const Main = {
  init: () => {

  },
  getMyInfo: () => {
    $.ajax({
      url: '/api/weixin/my_info',
      data: {

      },
      type:'get',
      dataType: 'json',
      success: () => {

      }
    })
  }
}
