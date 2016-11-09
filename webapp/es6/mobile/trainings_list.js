const Main = {
  init: () => {
    Main.getTrainings();

    setTimeout(() => {
      $(document).on("click", '.cs-list', function(e) {
        e.stopPropagation();
        const self = $(this);
        const id = self.data('id');
        location.href = '/app/trainingsDetails#id=' + id;
      }).swipe({
        swiptLeft: () => {
          console.log(0);
        },
        swipeRight: () => {

        }
      });



    }, 200)
  },
  getTrainings: () => {
    // 获取训练列表
    $.ajax({
      url: '/api/weixin/my_trainings/all',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      success: (result) => {

        if (result.data) {

          const data = result.data;
          for (let key in data) {
            data[key].attributes['start-timeY'] = CS.setDateFormat({time:data[key].attributes['start-time'], format: 'yyyy-MM-dd'});
            data[key].attributes['start-timeH'] = CS.setDateFormat({time:data[key].attributes['start-time'], format: 'hh:mm'});
            data[key].attributes['end-timeH'] = CS.setDateFormat({time:data[key].attributes['end-time'], format: 'hh:mm'});
          }

          $(".cs-list-cell .cs-list").remove();

          console.log(result.data);
          CS.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.cs-list-cell',
            isAppend: 'append',
            data: result.data
          });

        }
      }
    })
  }
};


Main.init();
