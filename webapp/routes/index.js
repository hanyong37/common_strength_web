var http = require('http');

module.exports = function(app) {
  // global route
  app.get(['/', '/login'], function(req, res){
    res.render('login.html');
  });

  app.get(['index', 'index.html'], function(req, res) {

  });
  // app route
  const apps = ['course/store'];
  apps.forEach(function(item) {
    require('./' + item)(app);
  })
};
