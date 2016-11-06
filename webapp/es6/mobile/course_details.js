
const Main = {
  init: () => {

  },
  getSchedulesInfo: (a) => {
    $.ajax({
      url: '/api/weixin/schedules/' + a.id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': CS.token,
      },
      success: (result) => {
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
