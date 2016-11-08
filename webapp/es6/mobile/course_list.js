  const Main = {
    init: () => {
      Main.getSchedulesList();
      let $txtDate = $('.text-date');
      $('.btn-prev').on('click',function() {
        let thisDate = $txtDate.data('val');
        let prevDate = Time.getPrevDate(thisDate);
        $txtDate.html(prevDate.nowDate + ' ' + prevDate.week).data('val', prevDate.nowDate);
        Main.getSchedulesList();
      });

      $('.btn-next').on('click',function() {
        let thisDate = $txtDate.data('val');
        let nextDate = Time.getNextDate(thisDate);
        $txtDate.html(nextDate.nowDate + ' ' + nextDate.week).data('val', nextDate.nowDate);
        Main.getSchedulesList();
      });

      $(document).on("click", '.training-block', function(e) {
        e.stopPropagation();
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
            data[key].attributes['start-time'] = CS.setDateFormat({time:data[key].attributes['start-time'], format: 'hh:mm'});
            data[key].attributes['end-time'] = CS.setDateFormat({time:data[key].attributes['end-time'], format: 'hh:mm'});
            data[key].attributes['updated-at'] = CS.setDateFormat({time:data[key].attributes['updated-at'], format: 'hh:mm'});
          }

          $('.training-list .training-block').remove();

          CS.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.training-list',
            isAppend: 'append',
            data: data
          });
        }
      });
    }
  };

(function() {
  Main.init();
})();
