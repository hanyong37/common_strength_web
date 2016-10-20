
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
      const _name = $.trim($('#j-name').val());
      const _address = $.trim($("#j-address").val());
      const _telphone = $.trim($("#j-phone").val());

      Main.insertStoreInfo({
        id: '',
        name: _name,
        address: _address,
        telphone: _telphone,
        type: 'post'
      });
   },
  insertStoreInfo: (a)=> {
    $.ajax({
      url: '/api/admin/stores/' + a.id,
      data: {
        'store[name]': a.name,
        'store[address]': a.address,
        'store[telphone]': a.telphone
      },
      headers: {
        'X-Api-Key': csTools.token,
      },
      type: a.type,
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.data) {
          let msgTop = '';
          if (a.id) {
            msgTop = '修改';
          } else {
            msgTop = '添加';
          }

          csTools.msgModalShow({
            href: '/storeManage',
            msg: msgTop + '门店成功!'
          });
        }else{
          csTools.msgModalShow({
            // href: '/storeManage',
            msg: msgTop + '门店失败!'
          });
        }
      }
    })
  },
  updateStoreInfo: (a) => {
    $.ajax({
      url: '/api/store/updateStoreInfo',
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
          $('.js-modal-message').html('修改门店成功！');
          $('.js-btn-close').on('click', function(){
            location.href = 'storeManage';
          });
        }else{
          $('.js-modal-message').html('修改门店失败！');
        }
        $('#messageModal').modal();
      }
    })
  }
};

(function(){
  Main.init();
})();
