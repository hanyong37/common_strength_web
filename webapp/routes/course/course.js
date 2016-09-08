module.exports = function(app){

  app.get("/courseRules", function(req, res) {
    res.render('course_rules.html');
  });

  app.get("/courseManagement", function(req, res) {
    res.render('course_management.html');
  });

  app.get("/courseManagementAdd", function(req, res) {
    res.render('course_management_add.html');
  });

  app.get("/courseSort", function(req, res) {
    res.render('course_sort.html');
  });

  app.get("/courseSortAdd", function(req, res) {
    res.render('course_sort_add.html');
  });
};
