const Main = {
  init: () => {
    Main.getMyInfo();
  },
  getMyInfo: () => {
    $.ajax({
      url: '/api/weixin/my_info',
      headers: {
        'X-Api-Key': Wx.token,
      },
      type:'get',
      dataType: 'json',
      success: (result) => {
        if (result.data) {
          const attributes = result.data.attributes;
          console.log(attributes);
          CS.setNunjucksTmp({
            tmpSelector: '#tmp',
            boxSelector: '.cs-body',
            isAppend: 'append',
            data: attributes
          });
        }
      }
    })
  }
};

Main.init();
