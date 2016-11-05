
const Wx = {
  init: () => {
    Wx.isWxLogin();
  },
  getWxOpenid: () => { // 获取微信 openid

  },
  getUserInfo: () => {
    // 验证用户信息
    $.ajax({
      url: '/api/weixin/session',
      type: 'post',
      data: {
        openid: 'jiujiu_98'
      },
      dataType: 'json',
      success: (result) => {
        console.log(result);
        const token = result.data.attributes.token;
        const weixin = result.data.attributes.weixin;
        sessionStorage.token = token;
        sessionStorage.weixin = weixin;
      },
      complete: (result) => {
        console.log(result.status);

        if (result.status == 404) {
          const phoneHtml = '<div class="weui-cell weui-cell_vcode">'
              +'<div class="weui-cell__hd">'
              +'<label class="weui-label">手机号</label>'
              +'</div>'
              +'<div class="weui-cell__bd">'
              +'<input class="weui-input" type="tel" placeholder="请输入手机号">'
              +'</div>'
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
    // 获取用户信息
    $.ajax({
      url: '/api/weixin/register',
      type: 'post',
      data: {
        mobile: '18202755698',
        openid: '123123'
      },
      dataType: 'json',
      success: (result) => {
        console.log(result);
      },
      complete: (result) => {
        if (result.status === 404) {

        }

        if (result.status === 409) {
          CS.msgModalShow({
            msg: '此手机号已经绑定了另一个微信号，如果您更换了微信号，请与我们门店联系！',
            style: 'weui',
            isPhone: 'ios'
          });
        }

        if (result.status === 400) {

        }
        console.log(result);
      }
    });
  },
  isWxLogin: () => {
    const token = sessionStorage.token;
      if(location.pathname != '/app/register' && !token){
        location.href = '/app/register';
      }
  }
};

Wx.init();
