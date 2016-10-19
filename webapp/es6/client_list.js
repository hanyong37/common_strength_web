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
      url: '/api/admin/customers',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log(result);
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_client_list',
          boxSelector: '.list-box',
          data: result.data,
          callback: () => {

          }
        });
      }
    });
  },
};

(function(){
  Main.init();
})();