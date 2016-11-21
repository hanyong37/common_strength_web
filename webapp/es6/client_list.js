
let Main = {
  init: () => {
    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      console.log('change');
      Main.getMemberShipsInfo();
    });

    Main.getStoreList();
    Main.getMemberShipsInfo();

    let $listBox = $('.list-box');
    $listBox.on('click', '.j-locked',function(){
      let id = $(this).data('id');
      Main.lockedOrUnlocked(id, true);
    });
    $listBox.on('click', '.j-unlocked', function(){
      let id = $(this).data('id');
      Main.lockedOrUnlocked(id, false);
    });

    $('.btn-query').on('click', function(){
      Main.getMemberShipsInfo();
    });
    $('.query-string').on('keypress', function(e){
      Main.getMemberShipsInfo();
    });
  },
  getStoreList: () => {
    $.ajax({
      url: '/api/admin/stores',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        const data = result.data;
        if(!data){
          alert('请先添加门店!');
          return false;
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: 'select.select-store',
          data: data,
          isAppend: true,
          callback: () => {
            $('.select-store').selectpicker('refresh');
          }
        });
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }
      }
    });
  },
  getMemberShipsInfo: () => {
    let storeId = $('.select-store').selectpicker('val');
    let qstring = $('.query-string').val();
    console.log(storeId);
    $.ajax({
      url: '/api/admin/customers?store_id=' + storeId + '&qstring=' + qstring,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        let data = result.data;
        for(let i = 0, lg = data.length; i < lg; i++){
          data[i].code = csTools.base64encode(csTools.utf16to8(data[i].id));
        }
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
  lockedOrUnlocked: (id, isLocked) => {
    let msg = '锁定';
    if(!isLocked){
      msg = '取消锁定';
    }
    $.ajax({
      url: '/api/admin/customers/' + id,
      type:  'PUT',
      dataType: 'json',
      data: {
        "customer[is_locked]": isLocked,
      },
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        if(result.status == 200){
          csTools.msgModalShow({
            msg: msg + '会员成功！',
            callback: () => {
              location.reload();
            }
          });
        }else{
          csTools.msgModalShow({
            msg: msg + '会员失败！'
          });
        }
      }
    });
  }
};

(function(){
  Main.init();
})();