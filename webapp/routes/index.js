const http = require('http');
const url = require('url');
const crypto = crypto.createHash('sha1');

const compute = (params) => {
  switch(params['type']){
    case "add": return parseFloat(params['num']) + parseFloat(params['num1']);break;
    case "subtract": return parseFloat(params['num']) - parseFloat(params['num1']);break;
    case "multiplication": return parseFloat(params['num']) * parseFloat(params['num1']);break;
    case "division": return parseFloat(params['num']) / parseFloat(params['num1']);break;
  }
};

module.exports = function(app) {
  // global route
  app.get([ '/login'], function(req, res){
    res.render('login.html');
  });

  app.get(['/', '/index'], function(req, res) {
    const token = 'Q29tbW9uU3RyZW5ndGg=';

    const url_params = url.parse(req.url, true);
    const query = url_params.query;

    const signature = query.signature;
    const timestamp = query.timestamp;
    const nonce = query.timestamp;

    let tmpArr = [token, timestamp, nonce];
    tmpArr.sort();
    let sha1 = crypto.createHash('sha1');
    let msg = arr[0] + arr[1] + arr[2];
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
  ];
  apps.forEach(function(item) {
    require('./' + item)(app);
  })
};
