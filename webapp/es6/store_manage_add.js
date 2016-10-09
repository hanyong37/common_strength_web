
const Main = {
  init: ()=> {
    $('.selectpicker').selectpicker({
      size: 4
    });
    $('#j-save').on('click', function() {
      Main.saveStoreInfo();
    });
  },
  saveStoreInfo: ()=> {
      // var uname = $.trim($('.input-username').val());
      // var pwd = $.trim($('.input-password').val());
      var _storeName = $.trim($('#j-name').val());
      var _storeAddress = $.trim($("#j-address").val());
      var _storeDescription = $.trim($("#j-text").val());

      Main.__ajax({
        storeId: '',
        storeName: _storeName,
        storeAddress: _storeAddress,
        storeDescription: _storeDescription
      });
   },
  __ajax: (a)=> {
    $.ajax({
      url: '/api/store/insertStoreInfo',
      data: {
        storeId: a.storeId,
        storeName: a.storeName,
        storeAddress: a.storeAddress,
        storeDescription: a.storeDescription
      },
      type: 'post',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {

        }
      }
    })
  }
};

(function(){
  Main.init();
})();
