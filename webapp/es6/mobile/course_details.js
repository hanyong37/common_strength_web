
const Main = {
  userData: {},
  init: () => {
    let param = location.href.split('#')[1].split('=')[1];
    console.log(param);
    Main.getSchedulesInfo(param);
    Main.getOperations(param);
  },
  getSchedulesInfo: (id) => {
    $.ajax({
      url: '/api/weixin/schedules/' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if(result.status == 200){
          let data = result.responseJSON.data;
          let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          let nWeek = new Date(data.attributes['start-time']).getDay();

          let tWeek = weekArr[nWeek];
          data.attributes['start_date'] = CS.setDateFormat({time: data.attributes['start-time'], format: 'yyyy-MM-dd '}) + tWeek;
          data.attributes['start_time'] = CS.setDateFormat({time: data.attributes['start-time'], format: 'hh:mm'});
          data.attributes['end_time'] = CS.setDateFormat({time: data.attributes['end-time'], format: 'hh:mm'});

          CS.setNunjucksTmp({
            tmpSelector: '#tmp',
            boxSelector: '.box',
            isAppend: 'append',
            data: data,
            callback: () => {
              $('.weui-desc').append(data.attributes['course-description']);
              data = null;
            }
          });
        }else if (result.status == 404) {
          CS.msgModalShow({
            msg: '获取课程信息失败',
            style: 'weui',
            isPhone: 'ios'
          });
        }else if (result.status == 403) {
          CS.msgModalShow({
            msg: '获取用户权限失败',
            style: 'weui',
            isPhone: 'ios'
          });
        }
      }
    })
  },
  cancelEvent: () => {
    $('.js-btn-cancel').on('click', function(){
      let id = $(this).data('id');
      CS.msgConfirmShow({
        msg: '确定取消该课程？',
        title: '提示',
        style: 'weui',
        isPhone: 'ios',
        btn: ['取消', '确定'],
        callback: () => {
          Main.delEvent(id);
        }
      });
    });
  },
  delEvent: (id) => {
    //cs-del
    console.log('cs-del', id);
    $.ajax({
      url: '/api/weixin/trainings/' + id,
      type: 'delete',
      dataType: 'json',
      data: {
        'trainings[booking-status]': 'cancelled'
      },
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if (result.status == 403) {
          CS.msgModalShow({
            msg: '该训练已无法取消，如需取消请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              location.reload();
            }
          });
        } else if (result.status == 200) {
          CS.msgModalShow({
            msg: '取消预约成功！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              location.reload();
            }
          });
        } else {
          CS.msgModalShow({
            msg: '该训练可能已结束，详情请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              location.reload();
            }
          });
        }
      }

    });
  },
  getOperations: (id) => {
    $.ajax({
      url: '/api/weixin/schedules/'+ id +'/schedule_operations',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        console.log(result.responseJSON);
        if(result.status == 200){
          var data = result.responseJSON.data;

          CS.setNunjucksTmp({
            tmpSelector: '#tmp_btn',
            boxSelector: '.box',
            isAppend: 'append',
            data,
            callback: ()=>{
              Main.bindBookOrWait(id);
              Main.cancelEvent();
              data = null;
            }
          });
        }
      }
    });
  },
  bindBookOrWait : (id) => {
    $('.js-btn-bookable').on('click', function() {
        Main.postBookOrWait(id);
    });

},
  postBookOrWait: (id) => {
    $.ajax({
      url: '/api/weixin/schedules/'+ id +'/booking',
      type: 'POST',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result)=>{
        if(result.status == 200){
          let bookingStatus = result.responseJSON.data.attributes['booking-status'];
          let msg;
          if(bookingStatus == 'booked'){
            msg = '预约成功！';
          }else{
            msg = '排队成功！'
          }
          CS.msgModalShow({
            msg,
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              history.back();
            }
          });
        }else if(result.status == 409){
          CS.msgModalShow({
            msg: result.attributes['schedule-reject-msg'],
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getOperations(id);
            }
          });
        }else if(result.status == 403){
          CS.msgModalShow({
            msg: result.attributes['customer-reject-msg'],
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getOperations(id);
            }
          });
        }else if(result.status == 404){
          CS.msgModalShow({
            msg: '该课程可能已被取消！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getOperations(id);
            }
          });
        }else{
          CS.msgModalShow({
            msg: '出现未知错误！errCode:'+ result.status,
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getOperations(id);
            }
          });
        }
      }
    });
  }
};

(function(){
  Main.init();
}());
