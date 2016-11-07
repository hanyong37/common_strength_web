$(function() {
  const Main = {
    init: () => {
      Main.getSchedulesList();
      console.log(1);

      $(".training-block").on("click", function() {
        const self = $(this);
        const id = self.data('id');
        location.href = '/app/courseDetails#id=' + id;
      });
    },
    getSchedulesList: () => {
      const time = $(".text-date").data('val');
      $.ajax({
        url:'/api//weixin/my_schedules/' + time,
        type: 'get',
        dataType: 'json',
        headers: {
          'X-Api-Key': Wx.token,
        },
        success: (result) => {
          const data = result.data;
          for (let key in data) {
            data[key].attributes['start-time'] = Wx.setDateFormat({time:data[key].attributes['start-time'], format: 'hh:mm'});
            data[key].attributes['end-time'] = Wx.setDateFormat({time:data[key].attributes['end-time'], format: 'hh:mm'});
            data[key].attributes['updated-at'] = Wx.setDateFormat({time:data[key].attributes['updated-at'], format: 'hh:mm'});
          }

          console.log(data);

          Wx.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.training-list',
            isAppend: 'append',
            data: data
          });
        }
      });
    }
  };

  Main.init();
});
