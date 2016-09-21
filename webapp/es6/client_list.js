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
      }
    });
  },
};
(function(){
  Main.init();
})();