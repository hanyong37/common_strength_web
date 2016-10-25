const Main = {
  init: () => {
    $('#select-store').selectpicker({
      size: 5
    });
    Main.getStoreList();

    $('#select-course').selectpicker({
      size: 5
    });
    Main.getCustomerList();
  },
  getTraninings: () => {

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
      console.log(1);
      $.ajax({
        url: '/api/admin/customers',
        type: 'get',
        dataType: 'json',
        headers: {
          'X-Api-Key': csTools.token,
        },
        success: (result) => {
          console.log(result);
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
        }
      })
    }
};


(function() {
  Main.init();
})();
