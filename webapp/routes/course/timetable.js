module.exports = function(app){
  app.get('/timeTable', function(req, res){
    res.render('time_tables.html');
  });
};