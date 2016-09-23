const Main = {
  init: ()=> {
    Main.__ajax();
  },
  __ajax: ()=> {
    $.ajax({
      url: '/api/course/getCoursesInfo',
      data: {
        currentPage: 0,
        pageSize: 10,
        keyword: ''
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {
          var data = result.data;
          Main.setNunjucks({
            tmp: '#temp',
            html: '.content-table.title',
            data: {
              data: data
            }
          })
        }
      }
    })
  },
  setNunjucks: (a)=> {
    var tpl_pay_template = $(a.tmp).html();
    var html = nunjucks.renderString(tpl_pay_template, a.data);
    var $c = $(a.html);
    $c.after(html);
  }
};

(function(){
  Main.init();
})();
