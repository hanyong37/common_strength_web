const Wx = {
  token: '',
  openId: sessionStorage.openId,
  init: () => {
    Wx.isWxLogin();
  },
  getUserInfo: () => {
    if(!Wx.openId){
      location.href = '/app/register';
      return false;
    }
    // 验证用户信息
    Wx.ajax({
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
    Wx.ajax({
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
  ajax: (options) => {
    let formatParams = (data) => {
      if(data){
        let params = [];
        for(let key in data){
          let _pName = encodeURIComponent(key);
          let _pValue = encodeURIComponent(data[key]);
          params.push(_pName + '=' + _pValue);
        }
        params.push('v='+ new Date().getTime());
        let paramStr = params.join('&');
        return paramStr;
      }
      return data;
    };

    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    let params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    let xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.fail && options.fail(status);
        }
      }
    };

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
      var _sendUrl = options.url;
      if(params){
        _sendUrl += "?" + params;
      }
      xhr.open("GET", _sendUrl, true);
      xhr.send(null);
    } else if (options.type == "POST") {
      xhr.open("POST", options.url, true);
      //设置表单提交时的内容类型
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    }
  },
  isWxLogin: () => {
    const token = sessionStorage.wxToken;
    if(!token){
      if(location.pathname != '/app/courseList'){
        location.href = '/app/courseList';
      }else{
        Wx.getUserInfo();
      }
    }else{
      Wx.token = token;
    }
  }
};

Wx.init();
