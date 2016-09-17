module.exports = function(app) {
  app.get(['/app/courseList'], function(req, res) {
    res.render('mobile/course_list.html');
  });
  app.get(['/app/courseDetails'], function(req, res) {
    res.render('mobile/course_details.html');
  });
};
