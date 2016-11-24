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

  app.get(['/app/courseList'], function(req, res) {
    res.render('mobile/course_list.html');
  });

  app.get(['/app/courseDetails'], function(req, res) {
    res.render('mobile/course_details.html');
  });

  app.get('/app/trainingsList', function(req, res) {
    res.render('mobile/trainings_list_new.html');
  });
}
