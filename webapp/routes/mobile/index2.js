const request = require('request');

module.exports = function(app) {

  app.get(['/app/redirect'], function(req, res) {
    let times = new Date().getTime();
    // let redirectUrl = encodeURIComponent('http://csxb1.free.natapp.cc/app/register');
    let redirectUrl = encodeURIComponent('http://commonstrength.cn/app/register');
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      'wx3e88f64ec69153c2' +
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
      'wx3e88f64ec69153c2' +
      '&secret=' +
      '042d99014f1ae55841ed797246883fcc',
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
      'wx3e88f64ec69153c2' +
      '&secret=042d99014f1ae55841ed797246883fcc&code=' +
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
