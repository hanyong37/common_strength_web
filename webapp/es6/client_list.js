let pageCurrent = 1;
let pageNumber = 10;
let pageCount = 1;
let filterText = '';
const Main = {
  init: () => {
    Main.getMemberShipsInfo(pageCurrent, pageNumber, filterText);
  },
  getMemberShipsInfo: (currentPage, pageSize, keyword) => {
    $.ajax({
      url: '/api/member/getMemberShipsInfo',
      type: 'get',
      dataType: 'json',
      data: {
        currentPage,
        pageSize,
        keyword,
      },
      success: (result) => {
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