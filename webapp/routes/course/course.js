module.exports = function(app){

  app.get("/courseRules", function(req, res) {
    res.render('course_rules.html');
  });

};
