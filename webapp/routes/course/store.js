module.exports = function(app){

  app.get("/storeManage", function(req, res) {
    res.render('store_manage.html');
  });

  app.get("/storeManageAdd", function(req, res) {
    res.render('store_manage_add.html');
  });

};
