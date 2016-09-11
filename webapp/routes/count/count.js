module.exports = function(app){
  app.get('/countClient', function(req, res){
    res.render('count_client.html');
  });
};
