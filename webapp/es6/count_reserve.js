const Main = {
  init: () => {
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD'
    });

    Main.getCountReserve({
      startTime: '',
      endTime: ''
    });

    $(".btn-info").on('click', function() {
      const start_datetime = $("#start_datetime").val();
      const over_datetime = $("#over_datetime").val();

      Main.getCountClientInfo({
        'startTime': start_datetime,
        'endTime': over_datetime
      });
    });

  },
  getCountReserve: (a) => {
    $.ajax({
      url: '/api/admin/course_report',
      data: {
        'from_date': a.startTime,
        'to_date': a.endTime
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
  }
}


Main.init();
