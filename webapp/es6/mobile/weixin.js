const openid = 'jiujiu_98';
let times = new Date().getTime();
var redirectUrl = encodeURIComponent('http://commonstrength.cn:9799/app/register');
var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
  'wx3e88f64ec69153c2' +
  '&redirect_uri=' +
  redirectUrl +
  '&response_type=code&scope=snsapi_base&state=' +
  times +
  '#wechat_redirect';


const Wx = {
  token: '',
  init: () => {
    let paramStr = location.href.split('?')[1];
    console.log(paramStr);
    if(paramStr){
      var params = paramStr.split('&');
      console.log(params);
      if(params){
        let paramObj = {};
        for(let i = 0, lg = params.length; i < lg; i++){
          let _arr = params[i].split('=');
          paramObj[_arr[0]] = _arr[1];
        }
        if(paramObj.code || paramObj.state){
          console.log(paramObj);
        }else{
          location.href = url;
        }
      }else{
        location.href = url;
      }
    }else{
      location.href = url;
    }


    // Wx.isWxLogin();
    // Wx.getWxOpenid();
  },
  getWxOpenid: () => { // 获取微信 openid
    $.ajax({
      url:'/app/getWxToken',
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        if(result.access_token){
          sessionStorage.access_token = result.access_token;
        }
      }
    });
  },
  getUserInfo: () => {
    // 验证用户信息
    $.ajax({
      url: '/api/weixin/session',
      type: 'post',
      data: {
        openid: openid
      },
      dataType: 'json',
      complete: (result) => {
        console.log('session', result);
        if(result.status == 200){
          const token = result.responseJSON.data.attributes.token;
          const weixin = result.responseJSON.data.attributes.weixin;
          sessionStorage.wxToken = token;
          sessionStorage.weixin = weixin;
          location.href = '/app/courseList';
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
        openid: openid
      },
      dataType: 'json',
      complete: (result) => {
        console.log(result);
        if (result.status === 404) {
          CS.msgModalShow({
            msg: '此手机号不是此门店的客户，请先联系门店！',
            style: 'weui',
            isPhone: 'ios'
          });
        }else if (result.status === 409) {
          CS.msgModalShow({
            msg: '此手机号已经绑定了另一个微信号，如果您更换了微信号，请与我们门店联系！',
            style: 'weui',
            isPhone: 'ios'
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
          sessionStorage.wxToken = token;
          sessionStorage.weixin = weixin;
          location.href = '/app/courseList';
        }
      }
    });
  },
  isWxLogin: () => {
    const token = sessionStorage.wxToken;
    if(!token){
      if(location.pathname != '/app/register'){
        location.href = '/app/register';
      }else{
        Wx.getUserInfo();
      }
    }else{
      Wx.token = token;
      if(location.pathname == '/app/register'){
        location.href = '/app/courseList';
      }
    }
  }
};

Wx.isWxLogin();
