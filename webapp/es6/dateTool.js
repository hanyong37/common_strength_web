console.log('dateTool');
const Main = {
  init: () => {
    var date = Main.getDate();
    $('.date-box').text(date.nowDate + ' ' + date.week);
    $('.btn-prev').on('tap', function(){
      var prevDate = Main.getPrevDate(date);
      $('.date-box').text(prevDate.nowDate + ' ' + prevDate.week);
    });
    $('.btn-next').on('tap', function(){
      var prevDate = Main.getNextDate(date);
      $('.date-box').text(prevDate.nowDate + ' ' + prevDate.week);
    });
  },
  getDate: (_date = new Date()) => {
    const mydate = new Date(_date);
    const myyear = mydate.getYear() + 1900;
    const mymonth = mydate.getMonth()+1;//注：月数从0~11为一月到十二月
    const myday = mydate.getDate();
    const weekArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const myWeekIndex = mydate.getDay();
    const myWeek = weekArr[myWeekIndex];

    const nowDate = myyear + '-' + mymonth + '-' + myday;
    const obj = {
      nowDate,
      week: myWeek
    };
    return obj;
  },
  getPrevDate: (_date) => {
    const time = new Date(_date).getTime() - 24 * 60 * 60 * 1000;
    return dateTool.getDate(time);
  },
  getNextDate: (_date) => {
    const time = new Date(_date).getTime() + 24 * 60 * 60 * 1000;
    return dateTool.getDate(time);
  },
};

Main.init();

