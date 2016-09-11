module.exports = function(app){
  app.get('/trainingHistory', function(req, res){
    res.render('training_history.html');
  });
};