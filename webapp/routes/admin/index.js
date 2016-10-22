module.exports = function(app){
  app.get('/adminList', function(req, res){
    res.render('admin_list.html');
  });

  app.get('/adminListOper', function(req, res){
    res.render('admin_list_operate.html');
  });
};
