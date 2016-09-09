module.exports = function(app){
  app.get('/clientList', function(req, res){
    res.render('client_list.html');
  });

  app.get('/clientListAdd', function(req, res){
    res.render('client_list_add.html');
  });
};