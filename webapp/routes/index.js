const http = require('http');
const url = require('url');
const crypto = require('crypto');
const querystring = require('querystring');

module.exports = function(app) {

  // app.all('*',function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Origin');
  //   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //
  //   if (req.method == 'OPTIONS') {
  //     res.send(200); //让options请求快速返回
  //   }
  //   else {
  //     next();
  //   }
  // });

  // global route
  app.get(['/', '/login'], function(req, res){
    res.render('login.html');
  });

  app.get(['/index'], function(req, res) {
    const token = 'Q29tbW9uU3RyZW5ndGg=';

    const url_params = url.parse(req.url, true);
    const query = url_params.query;

    const signature = query.signature;
    const timestamp = query.timestamp;
    const nonce = query.nonce;

    let tmpArr = [token, timestamp, nonce];
    tmpArr.sort();
    let sha1 = crypto.createHash('sha1');
    let msg = tmpArr[0] + tmpArr[1] + tmpArr[2];
    sha1.update(msg);
    msg = sha1.digest('hex');
    // 验证
    if(msg == signature) {
      console.log('验证成功');
      res.end(query.echostr);
    } else {
      console.log('验证失败');
      res.end('微信登录验证失败，请重试！');
    }
  });

  app.get('/wx/createMenu', function(req, res){
    res.render('weixin/create_wxmenu.html');
  });

  // app.get('/test', function(req, res){
  //   res.send({code: 1});
  //   res.end();
  // });
  //
  // app.post('/ptest', function(req, res){
  //   console.log('body', req.body);
  //   res.send(req.body);
  //   res.end();
  // });

  // app route
  const apps = [
    'course/store',
    'course/timetable',
    'course/course',
    'client/client',
    'count/count.js',
    'training/training',
    'mobile/index',
    'mobile/index2',
    'admin/index'
  ];
  apps.forEach(function(item) {
    require('./' + item)(app);
  })
};
