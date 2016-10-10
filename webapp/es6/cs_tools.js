const csTools = {
  setNunjucksTmp: (options) => {
    const tpl_pay_template = $(options.tmpSelector).html();
    const html = nunjucks.renderString(tpl_pay_template, {data: options.data});
    const index_container = $(options.boxSelector);

    if(options.isAppend){
      index_container.append(html);
    }else{
      index_container.html(html);
    }
    if(options.callback){
      options.callback();
    }
  },
  setPagination: (options) => {
    var _pagination = $('.pagination');
    _pagination.empty();
    var li_upnext = '<li class="pageUp"><a href="#">&laquo;</a></li>'
                  + '<li class="pageNext"><a href="#">&raquo;</a></li>';
    _pagination.append(li_upnext);
    for (var i = 0; i < options.pageNum; i++) {
      const html = '<li><a href="#">1</a></li>';
      $(".pageUp").after(html);
    }

    options.callback();
  }
};
