$(function() {
  const Main = {
    init: () => {
      Main.getSchedulesList();
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
          console.log(result);
          CS.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.training-list',
            isAppend: 'append',
            data: result.data
          });
        }
      });
    }
  };

  Main.init();
});
