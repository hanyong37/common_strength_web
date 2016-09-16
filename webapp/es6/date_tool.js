
const Main = {
  init: () => {
    var date = Main.getDate();
    $('.date-box').html(date.nowDate + ' ' + date.week);

    $('.btn-prev').on('click', function(){
      var prevDate = Main.getPrevDate(date.nowDate);
      $('.date-box').html(prevDate.nowDate + ' ' + prevDate.week);
    });
    $('.btn-next').on('click', function(){
      var nextDate = Main.getNextDate(date.nowDate);
      $('.date-box').html(nextDate.nowDate + ' ' + nextDate.week);
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
    return Main.getDate(time);
  },
  getNextDate: (_date) => {
    const time = new Date(_date).getTime() + 24 * 60 * 60 * 1000;
    return Main.getDate(time);
  },
};

Main.init();

