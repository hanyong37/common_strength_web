const Main = {
  init: ()=> {
    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      console.log('change');
      Main.__ajax();
    });
    Main.getStoreList(function(){
      Main.__ajax();
    });

    //删除课程
  },
  __ajax: ()=> {
    let storeId = $('.select-store').selectpicker('val');
    $.ajax({
      url: '/api/admin/courses?store_id=' + storeId,
      headers: {
        "X-Api-Key": csTools.token
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.data) {
          let data = result.data;
          for(let i = 0, lg = data.length; i < lg; i++){
            data[i].code = csTools.base64encode(csTools.utf16to8(data[i].id));
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.list-container',
            data,
            callback: ()=>{
              $('.deleteCourse').off('click').on('click', function(){
                let _id = $(this).data('id');
                csTools.msgConfirmShow({
                  msg: '是否删除课程？',
                  callback: () => {
                    Main.deleteCourse(_id);
                  }
                });
              });
            }
          });
        }
      }
    })
  },
  getStoreList: (func) => {
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
            func();
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
  deleteCourse: (id) => {
    $.ajax({
      url: '/api/admin/courses/' + id,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        if (result.status == 204) {
          csTools.msgModalShow({
            msg: '删除课程成功！',
            callback: () => {
              Main.__ajax();
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '删除课程失败！'
          });
        }
      }
    });
  },
};

(function(){
  Main.init();
})();
