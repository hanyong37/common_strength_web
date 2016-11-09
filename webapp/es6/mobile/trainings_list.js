const Main = {
  init: () => {
    Main.getTrainings({
      page: 1,
      numValue: 10
    });

    setTimeout(() => {
      $(document).on("click", '.cs-list', function(e) {
        e.stopPropagation();
        const self = $(this);
        const id = self.data('id');
        location.href = '/app/trainingsDetails#id=' + id;
      }).swipe({
        swipeLeft: (e) => {
          console.log('左边', e);
        },
        swipeRight: (e) => {
          console.log('右边', e);
        }
      });

      // $(".")

    }, 200)
  },
  getTrainings: (a) => {
    // 获取训练列表
    $.ajax({
      url: '/api/weixin/my_trainings/all?page='+ a.page +'&per_page='+ a.numValue ,
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
