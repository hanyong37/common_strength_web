const Main = {
  init: () => {
    Main.getTraninings({
      store_id: '',
      customer_id: ''
    });
    $('#select-store').selectpicker({
      size: 5
    });
    Main.getStoreList();

    $('#select-course').selectpicker({
      size: 5
    });
    Main.getCustomerList();


  },
  getTraninings: (a) => {
    if (a.store_id == undefined) {
      a.store_id = "";
    }

    if (a.customer_id == undefined) {
      a.customer_id = "";
    }

    $.ajax({
      url: '/api/admin/trainings?store_id=' + a.store_id + "&customer_id=" + a.customer_id,
      data:{
        'store_id': a.store_id,
        'customer_id': a.customer_id
      },
      headers: {
        'X-Api-Key': csTools.token,
      },
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result)
      }
    })
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
            tmpSelector: '#temp_storeList',
            boxSelector: '#select-store',
            data: data,
            isAppend: false,
            callback: () => {
              $('#select-store').selectpicker('refresh');
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
    getCustomerList: () => {
      $.ajax({
        url: '/api/admin/customers',
        type: 'get',
        dataType: 'json',
        headers: {
          'X-Api-Key': csTools.token,
        },
        success: (result) => {
          const data = result.data;
          csTools.setNunjucksTmp({
            tmpSelector: '#temp_courseList',
            boxSelector: '#select-course',
            data: data,
            isAppend: false,
            callback: () => {
              $('#select-course').selectpicker('refresh');
            }
          });
        },
        error: (xhr, textStatus, errorThrown) => {
          if(xhr.status == 403){
            location.href = 'login';
          }
        }
      })
    }
};


(function() {
  Main.init();
})();
