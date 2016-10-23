const Main = {
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
    var $startDatetime = $('#start_datetime');
    var $overDatetime = $('#over_datetime');
    $startDatetime.datetimepicker({
      format: 'hh:mm'
    });
    $overDatetime.datetimepicker({
      format: 'hh:mm',
      useCurrent: false
    });
    $startDatetime.on("dp.change", function (e) {
      $overDatetime.data("DateTimePicker").minDate(e.date);
    });

    Main.getStoreList();
    $('.js-btn-save').on('click', function(){
      Main.postSchedules();
    });
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
        console.log('getStoresInfo', result);
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
        console.log(result);
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
  getSchedules: (sid) => {
    let storeId = sid;
    let weekDay = moment().format('YYYY-MM-DD');

    $.ajax({
      url: '/api/admin/schedules?storeid=' + storeId + '&by_week=' + weekDay,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        console.log('course list', result);
      }
    });
  },

};

$(function(){
 Main.init();
});