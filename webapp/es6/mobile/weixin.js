

const Wx = {
  token: '',
  openId: sessionStorage.newOpenId,
  init: () => {
    Wx.isWxLogin();
  },
  getUserInfo: () => {
    if(!Wx.openId){
      Wx.sendUrl('/app/register');
      return false;
    }
    // 验证用户信息
        console.log('session', Wx.openId);
    $.ajax({
      url: '/api/weixin/session',
      type: 'post',
      data: {
        openid: Wx.openId
      },
      dataType: 'json',
      complete: (result) => {
        console.log('session', result);
        if(result.status == 200){
          const token = result.responseJSON.data.attributes.token;
          sessionStorage.nWxToken = token;
          location.reload();
        }else if (result.status == 404) {
          const phoneHtml = '<div class="weui-cell weui-cell_vcode">'
            +'<input class="weui-input input-tel" type="tel" placeholder="请输入手机号">'
            +'</div>';
          CS.msgConfirmShow({
            title: '提示',
            msg: phoneHtml,
            style: 'weui',
            isPhone: 'ios',
            btn: ['取消', '确定'],
            callback: () => {
              const $input = $("#iosDialog1").find(".weui-input");
              console.log($.trim($input.val()));
              if ($.trim($input.val()) == "") {
                CS.msgModalShow({
                  title: '提示',
                  msg: '手机号码不能空!',
                  style: 'weui',
                  isPhone: 'ios'
                });
                return false;
              }
              Wx.registerUser();
            }
          });
        }
      }
    });
  },
  registerUser: () => {
    let tel = $.trim($('.input-tel').val());
    // 获取用户信息
    $.ajax({
      url: '/api/weixin/register',
      type: 'post',
      data: {
        mobile: tel,
        openid: Wx.openId
      },
      dataType: 'json',
      complete: (result) => {
        console.log(result);
        if (result.status === 404) {
          CS.msgModalShow({
            msg: '此手机号不是我们的客户，请先联系门店！',
            style: 'weui',
            isPhone: 'ios'
          });
        }else if (result.status === 409) {
          CS.msgModalShow({
            msg: '此手机号已经绑定了另一个微信号，如果您更换了微信号，请与我们门店联系！',
            style: 'weui',
            isPhone: 'ios',
            callback: ()=>{
              WeixinJSBridge.invoke('closeWindow');
            }
          });
        }else if (result.status === 400) {
          CS.msgModalShow({
            msg: '请按正确姿势输入您的信息！',
            style: 'weui',
            isPhone: 'ios'
          });
        }else if(result.status === 200){
          const token = result.responseJSON.data.attributes.token;
          const weixin = result.responseJSON.data.attributes.weixin;
          sessionStorage.nWxToken = token;
          sessionStorage.newWeixin = weixin;
            Wx.sendUrl('/app/courseList');
        }
      }
    });
  },
  isWxLogin: () => {
    const token = sessionStorage.nWxToken;
    if(!token){
      if(location.pathname != '/app/courseList'){
          console.log('isWxLogin');
          Wx.sendUrl('/app/courseList');
      }else{
        console.log('getUserInfo');
        Wx.getUserInfo();
      }
    }else{
      Wx.token = token;
    }
  },
  sendUrl: (url) => {
    window.history.replaceState({name: 'wxViewport'}, null, url);
    location.reload();
  }
};

Wx.init();
