module.exports = function(app){
  app.get('/clientList', function(req, res){
    res.render('client_list.html');
  });

  app.get('/clientListAdd', function(req, res){
    res.render('client_list_add.html');
  });
  app.get('/clientCardList', function(req, res){
    res.render('client_card_list.html');
  });
  app.get('/clientCardListAdd', function(req, res){
    res.render('client_card_list_add.html');
  });
  app.get('/clientMemberInfo', function(req, res){
    res.render('client_member_info.html');
  });
};