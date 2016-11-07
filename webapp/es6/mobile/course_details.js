
const Main = {
  init: () => {
    var param = location.href.split('#')[1].split('=')[1];
    console.log(param);
    Main.getSchedulesInfo({
      id: param
    });
  },
  getSchedulesInfo: (a) => {
    $.ajax({
      url: '/api/weixin/schedules/' + a.id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      success: (result) => {
        var attributes = result.data.attributes;
        console.log(attributes['start-time']);
        attributes['start_date'] = CS.setDateFormat({time: attributes['start-time'], format: 'yyyy-MM-dd'});
        attributes['start_time'] = CS.setDateFormat({time: attributes['start-time'], format: 'hh:mm'});
        attributes['end_time'] = CS.setDateFormat({time: attributes['end-time'], format: 'hh:mm'});

        CS.setNunjucksTmp({
          tmpSelector: '#tmp',
          boxSelector: '.box',
          isAppend: 'append',
          data: result.data
        })
      },
      complete: (result) => {
        if (result.status == 404) {
          CS.msgModalShow({
            msg: '获取课程信息失败',
            style: 'weui',
            isPhone: 'ios'
          });
        }

        if (result.status == 403) {
          CS.msgModalShow({
            msg: '获取用户权限失败',
            style: 'weui',
            isPhone: 'ios'
          });
        }
      }
    })
  }
};

(function(){
  Main.init();
}());
