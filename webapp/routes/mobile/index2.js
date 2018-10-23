const request = require('request');

const AppID = 'wx4187e97165cc9be5';
const AppSecret = 'c7d039a556038a5d330e475f7e1a0f92';
module.exports = function(app) {

  app.get(['/app/redirect'], function(req, res) {
    let times = new Date().getTime();
    // let redirectUrl = encodeURIComponent('http://mg98p.free.natapp.cc/app/register');
    let redirectUrl = encodeURIComponent('https://commonstrength.cn/app/register');
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      AppID +
      '&redirect_uri=' +
      redirectUrl +
      '&response_type=code&scope=snsapi_base&state=' +
      times +
      '#wechat_redirect';

    res.send({code: 1, redirect: url});
    res.end();
  });

  app.get('/app/getWxToken', function(req, res){
    request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      AppID +
      '&secret=' +
      AppSecret,
      function(error, response, body){
        if (!error && response.statusCode == 200) {
          res.send(body);
        }else{
          res.send(body);
        }
        res.end();
      });
  });
  app.get('/app/getWxOpenid', function(req, res){
    let code = req.query.code;
    request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
      AppID +
      '&secret=' + AppSecret+
      '&code=' +
      code +
      '&grant_type=authorization_code',
      function(error, response, body){
        if (!error && response.statusCode == 200) {
          res.send(body);
        }else{
          res.send(body);
        }
        res.end();
      });
  });
};
