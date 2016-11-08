const request = require('request');

module.exports = function(app) {
  app.get(['/app/courseList'], function(req, res) {
    res.render('mobile/course_list.html');
  });
  app.get(['/app/courseDetails'], function(req, res) {
    res.render('mobile/course_details.html');
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
