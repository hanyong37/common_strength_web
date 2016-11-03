$(function() {
  const Main = {
    init: () => {
      CS.registerUser();
      Main.getSchedulesList();
    },
    getSchedulesList: () => {
      const time = $(".text-date").data('val');
      $.ajax({
        url:'/api//weixin/my_schedules/' + time,
        type: 'get',
        dataType: 'json',
        success: (result) => {
          console.log(result);
        }
      });
    }
  };

  Main.init();
});
