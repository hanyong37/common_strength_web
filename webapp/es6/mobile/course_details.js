
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
          data.attributes['start_date'] = CS.setDateFormat({time: data.attributes['start-time'], format: 'yyyy-MM-dd'});
          data.attributes['start_time'] = CS.setDateFormat({time: data.attributes['start-time'], format: 'hh:mm'});
          data.attributes['end_time'] = CS.setDateFormat({time: data.attributes['end-time'], format: 'hh:mm'});

          CS.setNunjucksTmp({
            tmpSelector: '#tmp',
            boxSelector: '.box',
            isAppend: 'append',
            data: data
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
            data: data,
            callback: ()=>{
              Main.bindBookOrWait(id);
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
