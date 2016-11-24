const Main = {
  init: () => {
    $('.form-datetimepicker').datetimepicker({
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
    });

    Main.bindEvent();
  },
  bindEvent: () => {
    $(".btn-info").off('click').on('click', function() {
      $(".btn-info").off('click');
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
    let url = '?from_date=' + a.startTime
      + '&to_date' + a.endTime
      + '&store_id=' + storeId;
    $.ajax({
      url: '/api/admin/course_report'+ url,
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
              Main.bindEvent();
              Main.setNumComplete(result.data);
            }
          });
        }
      }
    })
  },
  setNumComplete: (data) => {
    let sumNum = {
      absence: 0,
      beLate: 0,
      complete: 0,
      validBooking: 0
    };
    for(let i = 0, lg = data.length; i < lg; i++){
      sumNum.absence += data[i].attributes['count-of-absence'];
      sumNum.beLate += data[i].attributes['count-of-be-late'];
      sumNum.complete += data[i].attributes['count-of-complete'];
      sumNum.validBooking += data[i].attributes['count-of-valid-booking'];
    }
    sumNum.sum = sumNum.absence + sumNum.beLate + sumNum.complete + sumNum.validBooking;
    csTools.setNunjucksTmp({
      tmpSelector: '#tmp_num_sum',
      boxSelector: '.content-table-sum',
      isAppend: false,
      data: sumNum
    });
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
};


Main.init();
