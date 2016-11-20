const Main = {
  init: () => {
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD'
    });

    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    }).on('changed.bs.select', function(e){
      console.log('change');
      $(".btn-info").trigger('click');
    });

    Main.BindChangeStore(() => {
      Main.getCountReserve({
        startTime: '',
        endTime: ''
      });
    })

    $(".btn-info").on('click', function() {
      const start_datetime = $("#start_datetime").val();
      const over_datetime = $("#over_datetime").val();

      Main.getCountReserve({
        'startTime': start_datetime,
        'endTime': over_datetime
      });
    });

  },
  getCountReserve: (a) => {
    const storeId = $('.select-store').selectpicker('val');
    $.ajax({
      url: '/api/admin/course_report',
      data: {
        'from_date': a.startTime,
        'to_date': a.endTime,
        'store_id': storeId
      },
      headers: {
        'X-Api-Key': csTools.token,
      },
      type: 'get',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        if (result.data) {
          $('.content-table.list').remove();
          csTools.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.content-text',
            isAppend: 'append',
            data: result.data,
            callback: () => {
              Main.BindChangeEvent();
            }
          });
        }
      }
    })
  },
  BindChangeStore: (fun) => {
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

        $('.select-store option').remove();
        csTools.setNunjucksTmp({
          tmpSelector: '#temp_Select',
          boxSelector: 'select.select-store',
          data: data,
          isAppend: true,
          callback: () => {
            $('.select-store').selectpicker('refresh');
            fun();
          }
        });
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }
      }
    });
  }
}


Main.init();
