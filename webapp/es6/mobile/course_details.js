
const Main = {
  init: () => {
    var param = location.href.split('#')[1].split('=')[1];
    console.log(param);
    Main.getSchedulesInfo({
      id: param
    });
    Main.getoperations(param);
  },
  getSchedulesInfo: (a) => {
    $.ajax({
      url: '/api/weixin/schedules/' + a.id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if(result.status == 200){
          var data = result.responseJSON.data;
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
  getoperations: (id) => {
    ///weixin/schedules/1137/schedule_operations

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
  bindBookOrWait: (id) => {
    $('.weui-btn').on('click', function(){
      $.ajax({
        url: '/api/weixin/schedules/'+ id +'/booking',
        type: 'get',
        dataType: 'json',
        headers: {
          'X-Api-Key': Wx.token,
        },
        complete: (result)=>{
          console.log(result);
          if(result.status == 200){
            let bookingStatus = result.responseJSON.data.attributes['booking-status'];
            let msg;
            if(bookingStatus == 'booked'){
              msg = '预约成功！';
            }else{
              msg = '排队成功！'
            }
            csTools.msgModalShow({
              msg,
              callback: () => {
                Main.getoperations(id);
              }
            });
          }else if(result.status == 409){
            csTools.msgModalShow({
              msg: '排队人数已满，如需预约请咨询门店！',
              callback: () => {
                Main.getoperations(id);
              }
            });
          }
        }
      });
    });
  }
};

(function(){
  Main.init();
}());
