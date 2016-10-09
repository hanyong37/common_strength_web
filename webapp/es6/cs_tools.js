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
    options.callback();
  },
};