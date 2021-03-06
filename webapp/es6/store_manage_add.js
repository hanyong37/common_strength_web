
const Main = {
  storeData: $.url().fparam('data'),
  init: ()=> {
    let storeData = $.url().fparam('data');
    $('.selectpicker').selectpicker({
      size: 4
    });

    if (Main.storeData != undefined) {
      Main.storeData = JSON.parse(csTools.utf8to16(decodeURIComponent(Main.storeData)));

      console.log(Main.storeData);

      $('#j-name').val(Main.storeData.name);
      $("#j-address").val(Main.storeData.address);
      $("#j-phone").val(Main.storeData.telphone);
    }

    $('#j-save').on('click', function() {
      $('#j-save').off('click');
      Main.saveEvent();
    });

  },
  saveEvent: () => {
    const _name = $.trim($('#j-name').val());
    const _address = $.trim($("#j-address").val());
    const _telphone = $.trim($("#j-phone").val());
    if (Main.storeData != undefined) {
      Main.insertStoreInfo({
        id: Main.storeData.id,
        name: _name,
        address: _address,
        telphone: _telphone,
        type: 'put'
      });
    } else {
      Main.insertStoreInfo({
        id: '',
        name: _name,
        address: _address,
        telphone: _telphone,
        type: 'post'
      });
    }
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

      },
      complete: () => {
        $('#j-save').on('click', function() {
          $('#j-save').off('click');
          Main.saveEvent();
        });
      }
    })
  }
};

(function(){
  Main.init();
})();
