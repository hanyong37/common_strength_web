
const Main = {
  userData: {},
  init: () => {
    var param = location.href.split('#')[1].split('=')[1];
    console.log(param);
    Main.getUserInfo();
    Main.getSchedulesInfo({
      id: param
    });
    Main.getoperations(param);
  },
  getUserInfo: () => {
    $.ajax({
      url: '/api/weixin/my_info',
      headers: {
        'X-Api-Key': Wx.token,
      },
      type:'get',
      dataType: 'json',
      success: (result) => {
        if (result.data) {
          Main.userData = result.data.attributes;
        }
      }
    })
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
  $('.js-btn-bookable').on('click', function(){
    let isLocked = Main.userData['is-locked'];
    let _type = Main.userData['membership-type'];
    let nowTime = moment().getTime();
    let remainTime = Main.userData['membership-duedate'];
    let duedate = moment(Main.userData['membership-remaining-times'].slice(0,-1)).getTime();

    if(_type === 'time_card' &&  remainTime <= nowTime){
      CS.msgModalShow({
        msg: '您已经没有剩余的消费时间！',
        title: '提示',
        style: 'weui',
        isPhone: 'ios'
      });
      return false;
    }else if(_type !== 'time_card' &&  duedate <= 0){
      CS.msgModalShow({
        msg: '您已经没有剩余的消费次数！',
        title: '提示',
        style: 'weui',
        isPhone: 'ios'
      });
      return false;
    }
    if(isLocked){
      CS.msgModalShow({
        msg: '您的账户被锁定，请与门店联系。',
        title: '提示',
        style: 'weui',
        isPhone: 'ios',
        callback: ()=>{
          Main.getoperations(id);
        }
      });
    }else if(isLocked === false || isLocked === null){
      Main.postBookOrWait(id);
    }else{
      //membership-remaining-times
      CS.msgModalShow({
        msg: '操作太快，请稍后再试',
        title: '提示',
        style: 'weui',
        isPhone: 'ios'
      });
    }
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
        console.log(result);
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
            msg: '排队人数已满，如需预约请咨询门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getoperations(id);
            }
          });
        }else if(result.status == 403){
          CS.msgModalShow({
            msg: '课程暂时无法预约！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              Main.getoperations(id);
            }
          });
        }else{
          CS.msgModalShow({
            msg: '出现未知错误！errCode:'+ result.status,
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
          });
        }
      }
    });
  }
};

(function(){
  Main.init();
}());
