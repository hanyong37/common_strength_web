const Main = {
  init: () => {
    Main.getStoreList();
  },
  getStoreList: () => {
    $.ajax({
      url: '/api/store/getStoresInfo',
      data: {
        currentPage: 0,
        pageSize: 10,
        keyword: ''
      },
      type: 'get',
      dataType: 'json',
      success: function(result){
        console.log(result);
        if (result.code == 1) {
          var data = result.data;
          Main.setNunjucks({
            tmp: '#temp',
            html: '#j-html',
            data: {
              data: data
            }
          });
          if (result.totalPage != null) {

          }
        }
      }
    });
  },
  setNunjucks: (a)=> {
    var tpl_pay_template = $(a.tmp).html();
    var html = nunjucks.renderString(tpl_pay_template, a.data);
    var $c = $(a.html);
    $c.before(html);
  }
};

$(function() {
  Main.init();
});
