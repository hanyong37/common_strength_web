const Main = {
  theDate: moment().format('YYYY-MM-DD'),
  init: () => {
    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      let sid = $(this).selectpicker('val');
      Main.getSchedules(sid);
    });

    $('#select_store_add').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      Main.getCourseList();
    });

    $('#select_course').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      let defaultCapacity = $("#select_course option:selected").data('default-capacity');
      $('#course_number').val(defaultCapacity);
    });

    $('#course_date').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('#copy_datetime').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('#parse_datetime').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    var $startDatetime = $('#start_datetime');
    var $overDatetime = $('#over_datetime');
    $startDatetime.datetimepicker({
      format: 'HH:mm'
    });
    $overDatetime.datetimepicker({
      format: 'HH:mm',
      useCurrent: false
    });
    $startDatetime.on("dp.change", function (e) {
      $overDatetime.data("DateTimePicker").minDate(e.date);
    });

    Main.getStoreList();
    $('.js-btn-save').on('click', function(){
      Main.postSchedules();
    });

    $('.js-btn-copy').on('click', function(){
      let copy_datetime = $('#copy_datetime').val();
      let parse_datetime = $('#parse_datetime').val();
      Main.copySchedules(copy_datetime, parse_datetime);
    });
    $('.js-btn-delete').on('click', function(){
    let delete_datetime = Main.theDate;
      csTools.msgConfirmShow({
        msg: '确认清空当前课程表?',
        callback: () => {
          Main.deleteSchedules(delete_datetime);
        }
      });
    });

    Main.setWeekTitle();

    $('.btn-calendar-prev').on('click', function(){
      let nextDate = Main.prevWeek();
      Main.setWeekTitle(nextDate);
    });
    $('.btn-calendar-next').on('click', function(){
      let nextDate = Main.nextWeek();
      Main.setWeekTitle(nextDate);
    });
  },
  setWeekTitle: (_date) => {
    let weekArr = csTools.getWeekDay(_date);
    csTools.setNunjucksTmp({
      tmpSelector: '#tmp_date_block',
      boxSelector: '#date_box',
      data: weekArr,
    });
    csTools.setNunjucksTmp({
      tmpSelector: '#tmp_week_block',
      boxSelector: '#week_box',
      data: weekArr,
    });

    let sid = $('.select-store').selectpicker('val');
    Main.getSchedules(sid);
  },
  prevWeek: () => {
    let tDate = Main.theDate;
    console.log(tDate);
    let prevDate = moment(tDate).weekday(-7);
    let pDate = moment(prevDate).format('YYYY-MM-DD');
    Main.theDate = pDate;
    return pDate;
  },
  nextWeek: () => {
    let tDate = Main.theDate;
    console.log(tDate);
    let nextDate = moment(tDate).weekday(7);
    let nDate = moment(nextDate).format('YYYY-MM-DD');
    Main.theDate = nDate;
    return nDate;
  },
  getInputValue: (selector) => {
    return $.trim($(selector).val());
  },
  getStoreList: () => {
    $.ajax({
      url: '/api/admin/stores',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token
      },
      success: (result) => {
        const dataArr = result.data;
        if(dataArr.length <= 0){
          alert('请先添加门店!');
          return false;
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: '.select-store, #select_store_add',
          data: dataArr,
          isAppend: true,
          callback: () => {
            $('.select-store, #select_store_add').selectpicker('refresh');
          }
        });
      }
    });
  },
  getCourseList: ()=> {
    let storeId = $('#select_store_add').selectpicker('val');
    $.ajax({
      url: '/api/admin/courses?store_id=' + storeId,
      headers: {
        "X-Api-Key": csTools.token
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        if (result.data) {
          let data = result.data;
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_select_course',
            boxSelector: '#select_course',
            data,
            isAppend: true,
            callback: ()=>{
              $('#select_course').selectpicker('refresh');
            }
          });
        }
      }
    });
  },
  createDate: (str) => {
    let rdate = new Date(str);
    return rdate;
  },
  postSchedules: () => {
    let cDate = Main.createDate;
    let courseDate = $('#course_date').val();
    let start_time = courseDate + ' ' + $('#start_datetime').val();
    let end_time = courseDate + ' ' + $('#over_datetime').val();

    let data = {
      "schedule[store_id]": $('#select_store_add').selectpicker('val'),
      "schedule[course_id]": $('#select_course').selectpicker('val'),
      "schedule[start_time]": cDate(start_time),
      "schedule[end_time]": cDate(end_time),
      "schedule[capacity]": $('#course_number').val()
    };

    $.ajax({
      url: '/api/admin/schedules/',
      headers: {
        "X-Api-Key": csTools.token
      },
      type: 'POST',
      dataType: 'json',
      data,
      complete: (result) => {
        if(result.status == 201){
          $('#course_modal').modal('hide');
          csTools.msgModalShow({
            msg: '添加课程成功！',
            callback: () => {
              $('#select_store_add').selectpicker('val', '');
              $('#select_course').selectpicker('val', '');
              $('#course_date').val('');
              $('#start_datetime').val('');
              $('#over_datetime').val('');
              $('#course_number').val('');

              let sid = $('.select-store').selectpicker('val');
              Main.getSchedules(sid);
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '添加课程失败！'
          });
        }

      }
    });
  },
  copySchedules: (copy_datetime, parse_datetime) => {
    console.log(copy_datetime, parse_datetime);
    let storeId = $('.select-store').selectpicker('val');
    if(!storeId){
      $('#copy_modal').modal('hide');
      csTools.msgModalShow({
        msg: '请先选择门店！',
      });
      return false;
    }
    $.ajax({
      url: '/api/admin/stores/'+ storeId +'/schedules_by_week',
      type: 'POST',
      dataType: 'json',
      data: {
        from_week: copy_datetime,
        to_week: parse_datetime
      },
      headers: {
        'X-Api-Key': csTools.token
      },
      complete: (result) => {
        if(result.status == 200){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '复制课程表成功！',
            callback: () => {
              Main.getSchedules(storeId);
            }
          });
        }else if(result.status == 409){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '目标时间已存在课程表记录，请删除后复制！'
          });
        }else if(result.status == 403){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '所选时间没有制定课程！'
          });
        }else{
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '未知失败原因！'
          });
        }
      }
    });
  },
  deleteSchedules: (delete_datetime) => {
    console.log(delete_datetime);
    let storeId = $('.select-store').selectpicker('val');
    if(!storeId){
      $('#copy_modal').modal('hide');
      csTools.msgModalShow({
        msg: '请先选择门店！',
      });
      return false;
    }
    $.ajax({
      url: '/api/admin/stores/'+ storeId +'/schedules_by_week/' + delete_datetime,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token
      },
      complete: (result) => {
        if(result.status == 204){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '清空课程表成功！',
            callback: () => {
              Main.getSchedules(storeId);
            }
          });
        }else if(result.status == 409){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '当前课程表存在记录，删除失败！'
          });
        }else if(result.status == 403){
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '当前课程表没有制定课程！'
          });
        }else{
          $('#copy_modal').modal('hide');
          csTools.msgModalShow({
            msg: '未知失败原因！'
          });
        }
      }
    });
  },
  getSchedules: (sid) => {
    if(!sid){
      return false;
    }
    let storeId = sid;
    let weekDay = Main.theDate;
    $('#schedules_list').empty();
    let weekArr = csTools.getWeekDay(weekDay);

    $.ajax({
      url: '/api/admin/stores/' + storeId + '/schedules_by_week/' + weekDay,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        let rData = result.data;
        for(let i =0, lg = rData.length; i < lg; i++){
          rData[i] = {
            id: rData[i].id,
            attributes: rData[i].attributes,
            thisDate: moment(rData[i].attributes['start-time'].toString()).format('YYYY/MM/DD'),
            startTime: moment(rData[i].attributes['start-time'].toString()).format('HH:mm'),
            endTime: moment(rData[i].attributes['end-time'].toString()).format('HH:mm'),
          };
          //rData[i].thisDate = moment(rData[i].attributes['start-time'].toString()).format('YYYY/MM/DD');
          console.log(rData[i].thisDate);
        }
        for(let i2 = 0, lg2 = weekArr.length; i2 < lg2; i2++){
          let data = {
              resouce: rData,
              tDate: weekArr[i2].date
          };
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_shcedules',
            boxSelector: '#schedules_list',
            data,
            isAppend: true
          });
        }
      }
    });
  },

};

$(function(){
   Main.init();
});
