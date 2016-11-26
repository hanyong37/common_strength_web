
var hg =  window.innerHeight;
document.getElementsByClassName('weui-tab')[0].style.height = hg;
const Main = {
    init: () => {
      var hg = $(window).height();
      $('.weui-tab').height(hg);
      console.log('init');
      let $txtDate = $('.text-date');
      Main.popstateDate();

      $('.btn-prev').on('click',function() {
        let thisDate = $txtDate.data('val');
        let prevDate = Time.getPrevDate(thisDate);
        $txtDate.html(prevDate.nowDate + ' ' + prevDate.week).data('val', prevDate.nowDate);
        console.log('tap prev', prevDate.nowDate);
        history.replaceState({foo: prevDate.nowDate}, null, '#' + prevDate.nowDate);
        Main.getSchedulesList();
      });

      $('.btn-next').on('click',function() {
        let thisDate = $txtDate.data('val');
        let nextDate = Time.getNextDate(thisDate);
        $txtDate.html(nextDate.nowDate + ' ' + nextDate.week).data('val', nextDate.nowDate);
        console.log('tap next', nextDate.nowDate);
        history.replaceState({foo: nextDate.nowDate}, null, '#' + nextDate.nowDate);
        Main.getSchedulesList();
      });

    },
    popstateDate: () => {
      let $txtDate = $('.text-date');
      let urlDate = location.href.split('#')[1];
      if(urlDate){
        let urlWeek = Main.getWeek(urlDate);
        $txtDate.html(urlDate + ' ' + urlWeek).data('val', urlDate);
      }
      Main.getSchedulesList();
    },
    getWeek: (date) => {
      let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      let numWeek = new Date(date).getDay();
      let strWeek = weekArr[numWeek];
      weekArr = null;
      numWeek = null;
      return strWeek;
    },
    getSchedulesList: () => {
      let nowDate = new Date().getTime();
      const time = $(".text-date").data('val');
      $.ajax({
        url:'/api/weixin/my_schedules/' + time + '?tokentime=' + nowDate,
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
            data: data,
            callback: () => {

              $('.training-block').off('click').on("click", function(e) {
                e.stopPropagation();
                const self = $(this);
                const id = self.data('id');
                location.href = '/app/courseDetails#id=' + id;
              });
            }
          });
        }
      });
    }
  };

(function() {
  console.log('load');
  Main.init();
})();
