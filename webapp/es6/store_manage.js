$(function() {
  const Main = {
    init: () => {
      Main.getStoreList();
    },
    getStoreList: () => {
      $.ajax({
        url: '/api/store/getStoresInfo',
        type: 'get',
        dataType: 'json',
        data: {
          currentPage: 1,
          pageSize: 10,
          keyword: ''
        },
        success: function(result){
          console.log(result);
          console.log(result.data[0].storeName);
        }
      });
    },
  };

  //http://123.207.151.199:8080/member/getMemberShipsInfo

  Main.init();
});
