const Main = {
  init: () => {
    Main.getTraninings({
      store_id: '',
      customer_id: '',
      listNum: 10,
      page: 1
    });

    $('#select-store').selectpicker({
      size: 5
    });
    Main.getStoreList();

    $('#select-course').selectpicker({
      size: 5
    });
    Main.getCustomerList();

    setTimeout(() => {
      $("#j-search").on('click', function() {
        let _storeId = $("#select-store").val();
        let _customerId = $("#select-course").val();

        Main.getTraninings({
          store_id: _storeId,
          customer_id: _customerId,
          page: 1,
          listNum: 10
        });
      });
    }, 200);
  },
  getTraninings: (a) => {
    $.ajax({
      url: '/api/admin/trainings/',
      data:{
        'store_id': a.store_id,
        'customer_id': a.customer_id,
        'per_page': a.listNum,
        'page': a.page
      },
      headers: {
        'X-Api-Key': csTools.token,
      },
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        var data = result.data;
        $(".temp-list").remove();
        csTools.setNunjucksTmp({
          tmpSelector: '#tempList',
          boxSelector: '.content-table.title',
          isAppend: 'after',
          data: data
        });

        csTools.setPagination({
          pageNum: result.meta['total-pages']
        });
      }
    })
  },
  updateTraninings: () => {

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
