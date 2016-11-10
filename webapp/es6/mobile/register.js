const WxTool = {
  token: '',
  openId: '',
  init: () => {
    WxTool.redirectUrl();
  },
  redirectUrl: () => {
    $.ajax({
      url:'/app/redirect',
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        if(result.code == 1){
          let url = result.redirect;
          WxTool.runRedirect(url);
        }
      }
    });
  },
  runRedirect: (url) => {
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
          WxTool.getWxOpenid(paramObj.code);
        }else{
          location.href = url;
        }
      }else{
        location.href = url;
      }
    }else{
      location.href = url;
    }
  },
  getWxOpenid: (code) => { // 获取微信 openid
    $.ajax({
      url:'/app/getWxOpenid?code=' + code,
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        console.log(result.openid);
        if(result.errcode == 40029){
          location.href = '/app/register';
        }else{
          // sessionStorage.openId = result.openid;
          sessionStorage.openId = 'jiujiu_98';
          location.href = '/app/courseList';
        }
      }
    });
  }
};

WxTool.init();