const Main = {
  theDate: moment().format('YYYY-MM-DD'),
  scheduleData: {},
  page: 1,
  count: 1,
  init: () => {
    //门店选择
    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      let sid = $(this).selectpicker('val');
      $('#select_store_add').selectpicker('val', sid);
      Main.getSchedules(sid);
    });

    //展示门店
    $("#select_store_add").selectpicker();

    //添加训练 客户列表
    $('#trainings_select').selectpicker({
      size: 5,
      liveSearch: true
    });

    //课程选择
    $('#select_course').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      let defaultCapacity = $("#select_course option:selected").data('default-capacity');
      $('#course_number').val(defaultCapacity);
    });

    //添加编辑课程 时间选择
    $('#course_date').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('#copy_datetime').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('#parse_datetime').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    let $startDatetime = $('#start_datetime');
    let $overDatetime = $('#over_datetime');
    $startDatetime.datetimepicker({
      format: 'HH:mm'
    });
    $overDatetime.datetimepicker({
      format: 'HH:mm'
    });
    $startDatetime.on("dp.change", function (e) {
      console.log(e);
      $overDatetime.data("DateTimePicker").minDate(e.date);
      let concatDate = $('#course_date').val() + ' ' +$startDatetime.val();
      $overDatetime.val(moment(concatDate).add(1, 'hours').format('HH:mm'));
    });


    //门店列表
    Main.getStoreList();

    //课程删除
    $('.js-btn-del').on('click', function(){
      csTools.msgConfirmShow({
        msg: '确认删除此节课?',
        callback: () => {
          let id =$('#course_show_modal').data('id');
          Main.deleteSchedule(id);
        }
      });
    });

    //编辑课程弹窗
    $('.js-btn-update').on('click', function(){
      $('#course_show_modal').modal('hide');
      $('#course_modal').modal('show');
      Main.setSchedule();

      $('.js-btn-save').off('click').on('click', function(){
        $('.js-btn-save').off('click');
        Main.postSchedules();
      });
    });

    //复制一周课程
    $('.js-btn-copy').on('click', function(){
      let copy_datetime = $('#copy_datetime').val();
      let parse_datetime = $('#parse_datetime').val();
      Main.copySchedules(copy_datetime, parse_datetime);
    });
    //清空课程表
    $('.js-btn-delete').on('click', function(){
    let delete_datetime = Main.theDate;
      csTools.msgConfirmShow({
        msg: '确认清空当前课程表?',
        callback: () => {
          Main.deleteSchedules(delete_datetime);
        }
      });
    });

    //设置一周时间
    Main.setWeekTitle();

    //上一周，下一周
    $('.btn-calendar-prev').on('click', function(){
      let nextDate = Main.prevWeek();
      Main.setWeekTitle(nextDate);
    });
    $('.btn-calendar-next').on('click', function(){
      let nextDate = Main.nextWeek();
      Main.setWeekTitle(nextDate);
    });


    //课程点击查看详情
    $('#schedules_list').on('click', '.column-cell', function(){
      let id = $(this).data('id');
      let isTrue = $(this).data('publish');
      let bookNumber = $(this).data('booknumber');
      $('#course_show_modal').data('id', id);

      //判断是否发布
      let $btnPublishAndDel = $('.js-btn-published, .js-btn-del');
      if(bookNumber > 0){
        $btnPublishAndDel.hide();
      }else{
        $btnPublishAndDel.show();
      }


      if(!isTrue){
        $('.js-create-trainings').hide();
        $('.js-btn-update').show();
        $('.js-btn-published').text('发布').data('publish', false);
      }else{
        $('.js-create-trainings').show();
        $('.js-btn-update').hide();
        $('.js-btn-published').text('取消发布').data('publish', true);
      }
      console.log($('#course_show_modal').data('id'));
      Main.editSchedule(id);
    });

    //发布点击事件
    $('.btn-publish').on('click', function(){
      let hasClass = $(this).hasClass('unpublish');
      Main.publishEvent(hasClass);
    });

    //添加课程
    $('#add_course_modal').on('click', function(){
      let _date = Main.theDate;
      activeAddCourse(_date);
    });

    //星期点击 添加课程
    $('#week_box').on('click', '.calendar-row-info', function(){
      let _index = $(this).index();
      let _date = $('#date_box .calendar-row-info').eq(_index).text();

      activeAddCourse(_date);
    });
    $('#date_box').on('click', '.calendar-row-info', function(){
      let _date = $(this).text();

      activeAddCourse(_date);
    });
    function activeAddCourse(_d){
      Main.clearModal();
      let sid = $(this).selectpicker('val');
      Main.getCourseList(sid);
      $('#course_modal').modal();

      $('#course_date').val(_d);
      $('.js-btn-save').off('click').on('click', function(){
        $('.js-btn-save').off('click');
        Main.postSchedules();
      });
    }

    $('#add_copy_modal').on('click', function(){
      let _date = $('#date_box').find('.calendar-row-info').eq(0).text();
      _date = moment(_date).format('YYYY-MM-DD');
      $('#copy_datetime').val(_date);
      $('#parse_datetime').val('');
      $('#copy_modal').modal();
    });

    //添加训练
    $('.js-btn-create').on('click', function(){
      let customer_id = $('#trainings_select').selectpicker('val');
      let schedule_id = $(this).data('id');
      let store_id = $('.select-store').selectpicker('val');
      let booking_status = 'no_booking';
      let training_status = 'normal';
      $.ajax({
        url: '/api/admin/trainings/',
        type: 'POST',
        dataType: 'json',
        headers: {
          "X-Api-Key": csTools.token
        },
        data: {
          "training[schedule_id]": schedule_id,
          "training[customer_id]": customer_id,
          "training[store_id]": store_id,
          "training[booking_status]": booking_status,
          "training[training_status]": training_status
        },
        complete: (result) => {
          console.log(result);
          //trainings_box
          if(result.status == 201){
            csTools.msgModalShow({
              msg: '添加训练成功！',
              callback: () => {
                $('#trainings_modal').modal('hide');
                $('.js-btn-published, .js-btn-del').hide();
                Main.getTrainings(schedule_id);
                Main.getSchedules(store_id);
              }
            });
          }else if(result.status == 422){
            csTools.msgModalShow({
              msg: '该客户已添加到此次训练！'
            });
          }else{
            csTools.msgModalShow({
              msg: '添加训练失败！'
            });
          }
        }
      });
    });
    let $trainingsBox = $('#trainings_box');
    $trainingsBox.on('click', '.cancel-training', function(){
      let id = $(this).parent().data('id');
      csTools.msgConfirmShow({
        msg: '是否取消训练？',
        callback: () => {
          Main.delTrainings(id);
        }
      });
    });
    $trainingsBox.on('click', '.waiting-training', function(){
      let id = $(this).parent().data('id');
      let data = {
        "training[booking_status]": 'cancelled',
        "training[training_status]": 'not_start'
      };
      csTools.msgConfirmShow({
        msg: '是否排队成功？',
        callback: () => {
          Main.setTrainings(id, data, '排队成功');
        }
      });
    });
    $trainingsBox.on('click', '.later-training', function(){
      let id = $(this).parent().data('id');
      let data = {
        "training[training_status]": 'be_late'
      };
      Main.setTrainings(id, data, '更新状态 迟到 ');
    });
    $trainingsBox.on('click', '.absence-training', function(){
      let id = $(this).parent().data('id');
      let data = {
        "training[training_status]": 'absence'
      };
      Main.setTrainings(id, data, '更新状态 缺勤 ');
    });
    $trainingsBox.on('click', '.complete-training', function(){
      let id = $(this).parent().data('id');
      let data = {
        "training[training_status]": 'normal'
      };
      Main.setTrainings(id, data, '更新状态 完成 ');
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
            let sid = $('.select-store').selectpicker('val');
            Main.getSchedules(sid);
          }
        });
      }
    });
  },
  getCourseList: (id)=> {
    let storeId = $('.select-store').selectpicker('val');
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
            callback: ()=>{
              $('#select_course').selectpicker('refresh');
              if(id){
                $('#select_course').selectpicker('val', id);
              }
            }
          });
        }
      }
    });
  },
  createDate: (str) => {
    let rdate = moment(str).format();
    return rdate;
  },
  setSchedule: () => {
    let data = Main.scheduleData;
    $('#course_modal').data('id', data.id);
    $('#course_date').val(data.courseDate);
    $('#start_datetime').val(data.startTime);
    $('#over_datetime').val(data.endTime);
    Main.getCourseList(data.courseId);
    $('#course_number').val(data.capacity);
  },
  postSchedules: () => {
    let cDate = Main.createDate;
    let courseDate = $('#course_date').val();
    let start_time = courseDate + ' ' + $('#start_datetime').val();
    let end_time = courseDate + ' ' + $('#over_datetime').val();

    let data = {
      "schedule[store_id]": $('.select-store').selectpicker('val'),
      "schedule[course_id]": $('#select_course').selectpicker('val'),
      "schedule[start_time]": cDate(start_time),
      "schedule[end_time]": cDate(end_time),
      "schedule[capacity]": $('#course_number').val()
    };
    let type = 'POST';
    let dataId = $('#course_modal').data('id');
    let msg = '添加课程';
    if(dataId){
      type = 'PUT';
      msg = '修改课程';
    }else{
      dataId = '';
    }

    $.ajax({
      url: '/api/admin/schedules/' + dataId,
      headers: {
        "X-Api-Key": csTools.token
      },
      type,
      dataType: 'json',
      data,
      complete: (result) => {
        if(result.status == 201 || result.status == 200){
          $('#course_modal').modal('hide');
          csTools.msgModalShow({
            msg: msg + '成功！',
            callback: () => {
             Main.clearModal();

              let sid = $('.select-store').selectpicker('val');
              Main.getSchedules(sid);
            }
          });
        }else{
          csTools.msgModalShow({
            msg: msg + '失败！'
          });
        }

        $('.js-btn-save').off('click').on('click', function(){
          $('.js-btn-save').off('click');
          Main.postSchedules();
        });
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
  deleteSchedule: (id) => {
    $.ajax({
      url: '/api/admin/schedules/' + id,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token
      },
      complete: (result) => {
        if(result.status == 204){
          csTools.msgModalShow({
            msg: '删除成功！',
            callback: () => {
              $('#course_show_modal').modal('hide');
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '删除课程失败！'
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
  editSchedule: (id) => {
    Main.scheduleData = {};
    $.ajax({
      url: '/api/admin/schedules/' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        console.log('sc', result);
        if(result.data){
          let id = result.data.id;
          let attributes = result.data.attributes;

          let courseDate = moment(attributes['start-time']).format('YYYY-MM-DD');
          let startTime = moment(attributes['start-time']).format('HH:mm');
          let endTime = moment(attributes['end-time']).format('HH:mm');
          let capacity = attributes.capacity;
          let storeId = attributes['store-id'];
          let storeName = attributes['store-name'];
          let courseId = attributes['course-id'];
          let courseName = attributes['course-name'];

          let tmpData = {
            id,
            courseDate,
            startTime,
            endTime,
            storeId,
            storeName,
            courseId,
            courseName,
            capacity,
          };

          Main.scheduleData = tmpData;

          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_show_block',
            boxSelector: '#course_show_body',
            data: tmpData,
            callback: () => {
              $('#course_show_modal').modal('show');
              Main.getTrainings(id);
              let storeid = $('.select-store').selectpicker('val');
              Main.getCustomersModal(storeid);

              $('.js-btn-published').off('click').on('click', function(){
                let publishStatus = $(this).data('publish');
                let msg = '发布';
                if(publishStatus){
                  msg = '取消发布';
                }

                let isPublished =  true;
                if(publishStatus == true){
                  isPublished = false;
                }
                console.log(publishStatus, id);
                $.ajax({
                  url: '/api/admin/schedules/' + id,
                  type: 'PUT',
                  dataType: 'json',
                  headers: {
                    "X-Api-Key": csTools.token
                  },
                  data: {
                    "schedule[is_published]": isPublished
                  },
                  complete: (result) => {
                    console.log(result);
                    if(result.status == 201 || result.status == 200){
                      $('#course_show_modal').modal('hide');
                      csTools.msgModalShow({
                        msg: msg + '成功！',
                        callback: () => {
                           Main.clearModal();

                          let sid = $('.select-store').selectpicker('val');
                          Main.getSchedules(sid);
                        }
                      });
                    }else{
                      csTools.msgModalShow({
                        msg: msg + '失败！'
                      });
                    }
                  }
                });
              });
            }
          });
        }
      }
    });
  },
  clearModal: ()=>{
    $('#select_course').selectpicker('val', '');
    $('#course_date').val('');
    $('#start_datetime').val('00:00');
    $('#over_datetime').val('00:00');
    $('#course_number').val('');
    $('#course_modal').data('id', '');
  },
  pageNumEvent: () => {

    $('.js-pagination').on('click', '.js-first', function(){
      console.log('first');
      Main.getMemberShipsInfo(1);
    }).on('click', '.js-prev', function(){
      console.log('prev');
      if(Main.page > 1){
        Main.page -= 1;

        Main.getMemberShipsInfo(Main.page);
      }
    }).on('click', '.js-next', function(){
      console.log('next');
      if(Main.page < Main.count){
        Main.page += 1;

        Main.getMemberShipsInfo(Main.page);
      }
    }).on('click', '.js-last', function(){
      console.log('last');
      Main.getMemberShipsInfo(Main.count);
    });
  },
  setTrainings: (id, data, msg) => {
    $.ajax({
      url: '/api/admin/trainings/' + id,
      type: 'PUT',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      data,
      complete: (result) => {
        console.log('trainings_update', result);

        if(result.status == 200){
          csTools.msgModalShow({
            msg: msg+'成功！',
            callback: () => {
              let schId = $('.js-btn-create').data('id');
              Main.getTrainings(schId);
            }
          });
        }else{
          csTools.msgModalShow({
            msg: msg+'不成功！',
            callback: () => {
              let schId = $('.js-btn-create').data('id');
              Main.getTrainings(schId);
            }
          });
        }
      }
    });
  },
  delTrainings: (id) => {
    $.ajax({
      url: '/api/admin/trainings/' + id,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        console.log('delTrainings', result);

        if(result.status == 204){
          csTools.msgModalShow({
            msg: '删除训练成功！',
            callback: () => {
              let schId = $('.js-btn-create').data('id');
              Main.getTrainings(schId);
            }
          });
        }else if(result.status == 422){
          csTools.msgModalShow({
            msg: '删除训练失败！已有训练记录产生！',
            callback: () => {
              let schId = $('.js-btn-create').data('id');
              Main.getTrainings(schId);
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '删除训练失败！错误原因：' + result.status,
            callback: () => {
              let schId = $('.js-btn-create').data('id');
              Main.getTrainings(schId);
            }
          });
        }
      }
    });
  },
  getTrainings: (id, page) => {
    page = page || 1;
    $('.js-btn-create').data('id', id);
    $.ajax({
      url: '/api/admin/schedules/' + id + '/trainings'+ "?page=" + page,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        console.log('trainings_box', result);
        //trainings_box
        let data = result.data;
        let nDate = new Date().getTime();
        for(let i = 0, lg = data.length; i < lg; i++){
          let dEndDate = new Date(data[i].attributes['end-time']).getTime();
          let dStartDate = new Date(data[i].attributes['start-time']).getTime();

          console.log(dEndDate, dStartDate, nDate);

          if(dEndDate < nDate){
            data[i].attributes['trainings-booking'] = 'complete';
          }else if(dStartDate > nDate ){
            data[i].attributes['trainings-booking'] = 'no_start';
          }else{
            data[i].attributes['trainings-booking'] = 'starting';
          }
        }
        let meta = result.meta;
        Main.page = meta["current-page"];
        Main.count = meta["total-pages"];
        $('.js-page').text(Main.page);

        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_trainings_box',
          boxSelector: '#trainings_box',
          data: data
        });
      }
    });

  },
  getCustomersModal: (id) => {
    $.ajax({
      url: '/api/admin/customers?store_id=' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        console.log(result);
        //trainings_box
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_customers',
          boxSelector: '#trainings_select',
          data: result.data,
          callback: () => {
            $('#trainings_select').selectpicker('refresh');
          }
        });
      }
    });
  },
  getSchedules: (sid) => {
    console.log('getSchedules');
    if(!sid){
      return false;
    }
    let $btnPulish = $('.btn-publish');
    $btnPulish.text('发布本周课程').removeClass('unpublish');
    let storeId = sid;
    let weekDay = Main.theDate;
    let weekArr = csTools.getWeekDay(weekDay);

    $.ajax({
      url: '/api/admin/stores/' + storeId + '/schedules_by_week/' + weekDay,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        $('#schedules_list').empty();
        let rData = result.data;

        for(let i =0, lg = rData.length; i < lg; i++){
          rData[i].attributes.thisDate = moment(rData[i].attributes['start-time'].toString()).format('YYYY/M/D');
          rData[i].attributes.startTime = moment(rData[i].attributes['start-time'].toString()).format('HH:mm');
          rData[i].attributes.endTime = moment(rData[i].attributes['end-time'].toString()).format('HH:mm');

          if(rData[i].attributes['is-published'] || rData[i].attributes['is-published'] == 'true'){
            $btnPulish.text('取消发布本周课程').addClass('unpublish');
          }
        }
        $btnPulish.removeClass('hide');
        console.log(rData);
        for(let i2 = 0, lg2 = weekArr.length; i2 < lg2; i2++){
          let data = {
              resouce: rData,
              tDate: weekArr[i2].date
          };
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_schedules',
            boxSelector: '#schedules_list',
            data,
            isAppend: true
          });
        }
      }
    });
  },
  publishEvent: (unPublish) => {
    let url = 'publish_all';
    let sid = $('.select-store').selectpicker('val');
    let weekDay = Main.theDate;
    let msg = '发布';
    if(unPublish){
      url = 'unpublish_all';
      msg = '取消发布';
    }

    $.ajax({
      url: '/api/admin/stores/' + sid + '/schedules_by_week/' + weekDay + '/' + url,
      type: 'POST',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        if (result.status == 204) {
          msg += '本周课程成功！',
          csTools.msgModalShow({
            msg: msg + '本周课程成功！',
            callback: () => {
              Main.getSchedules(sid);
            }
          });
        }else if(result.status == 409){
          msg = '已有训练参生，不可取消发布！';
        }else if(result.status == 404){
          msg = '本周没有课程！';
        }else{
          msg += '本周课程失败！';
        }

        csTools.msgModalShow({
          msg,
          callback: () => {
            Main.getSchedules(sid);
          }
        });
      }
    });
  },
};

$(function(){
   Main.init();
});
