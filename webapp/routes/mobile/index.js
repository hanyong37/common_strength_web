module.exports = function(app) {
  app.get(['/app/index', '/app/index.html'], function(req, res) {

  });

  app.get('/app/messageCenter', function(req, res) {
    res.render('mobile/message_center.html');
  })
}
