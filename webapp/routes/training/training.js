module.exports = function(app){
  app.get('/trainingHistory', function(req, res){
    res.render('training_history.html');
  });
  app.get('/trainingReservation', function(req, res){
    res.render('training_reservation.html');
  });
  app.get('/trainingTourist', function(req, res){
    res.render('training_tourist.html');
  });
};