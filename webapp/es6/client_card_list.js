const Main = {
  init: () => {
    Main.getClientCardList();
  },
  getClientCardList: () => {
    $.ajax({
      url: '/api/member/getCardOperationsInfo',
      type: 'get',
      dataType: 'json',
      data: {
        memberShipId: '',
        currentPage: 1,
        pageSize: 10,
        keyword: ''
      },
      success: function(result){
        console.log(result);
        Main.setNunjucksTmp({
          tpl_pay_template: '#tmp_client_list',
          index_container: '.list-box',
          data: result.data
        });
      }
    });
  },
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

(function(){
  Main.init();
})();