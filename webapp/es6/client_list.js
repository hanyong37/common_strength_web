
let Main = {
  init: () => {
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
              Main.getMemberShipsInfo();
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