var http = require('http');

module.exports = function(app) {
  // global route
  app.get(['/', 'index.html'], function(req, res) {
    var i = 0;
    if (i = 0) {

    } else {
      res.render('index.html',{
        title: '这就是命!',
        list: [
          {
            a: '这个东西怎么玩!'
        }
        ]

      });
    }


  });
  // app route
  // const apps = ['activity','class'];
  // apps.forEach(function(item) {
  //   require('./' + item)(app);
  // })
};
