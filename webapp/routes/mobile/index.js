module.exports = function(app) {
  app.get(['/app/register'], function(req, res) {
    res.render('mobile/register.html');
  });

  app.get('/app/messageCenter', function(req, res) {
    res.render('mobile/message_center.html');
  });

  app.get('/app/my', function(req, res) {
    res.render('mobile/my.html');
  });

  app.get('/app/myReserve', function(req, res) {
    res.render('mobile/my_reserve.html');
  });
}
