const WxTool = {
  token: '',
  openId: '',
  init: () => {
    WxTool.redirectUrl();
  },
  redirectUrl: () => {
    WxTool.ajax({
      url:'/app/redirect',
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        console.log(result.code);
        var data = JSON.parse(result);
        if(data.code == 1){
          let url = data.redirect;
          WxTool.runRedirect(url);
        }else{
          location.reload();
        }
      }
    });
  },
  runRedirect: (url) => {
    let paramStr = location.href.split('?')[1];
    console.log('paramStr', paramStr);
    if(paramStr){
      var params = paramStr.split('&');
      console.log('params',params);
      if(params){
        let paramObj = {};
        for(let i = 0, lg = params.length; i < lg; i++){
          let _arr = params[i].split('=');
          paramObj[_arr[0]] = _arr[1];
        }
        console.log('paramObj', paramObj);
        if(paramObj.code && paramObj.state){
          console.log(paramObj);
          WxTool.getWxOpenid(paramObj.code);
        }else{
          // alert('url3');
          location.href = url;
        }
      }else{
        // alert('url2');
        location.href = url;
      }
    }else{
      // alert('url1');
      location.href = url;
    }
  },
  getWxOpenid: (code) => { // 获取微信 openid
    WxTool.ajax({
      url:'/app/getWxOpenid?code=' + code,
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        console.log(result.openid);
        const data = JSON.parse(result);
        if(result.errcode == 40029){
          location.href = '/app/register';
        }else{
          sessionStorage.nOpenId = data.openid;
          // sessionStorage.openId = 'jiujiu_98';
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
};

WxTool.init();
