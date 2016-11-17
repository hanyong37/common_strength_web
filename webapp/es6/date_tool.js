const Time = {
  init: () => {
    let date = Time.getDate();
    let $txtDate = $('.text-date');
    $txtDate.html(date.nowDate + ' ' + date.week).data('val', date.nowDate);
    console.log($txtDate.data('val'));

  },
  getDate: (_date = new Date()) => {
    const mydate = new Date(_date);
    const myyear = mydate.getYear() + 1900;
    let mymonth = mydate.getMonth()+1;//注：月数从0~11为一月到十二月
    let myday = mydate.getDate();
    const weekArr = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六',];
    const myWeekIndex = mydate.getDay();
    const myWeek = weekArr[myWeekIndex];

    if (String(mymonth).length === 1) {
      mymonth = "0" + mymonth;
    }

    if(String(myday).length === 1) {
      myday = "0" + myday;
    }
    console.log(myday);

    const nowDate = myyear + '-' + mymonth + '-' + myday;
    const obj = {
      nowDate,
      week: myWeek
    };
    return obj;
  },
  getPrevDate: (_date) => {
    const time = new Date(_date).getTime() - 24 * 60 * 60 * 1000;
    return Time.getDate(time);
  },
  getNextDate: (_date) => {
    const time = new Date(_date).getTime() + 24 * 60 * 60 * 1000;
    return Time.getDate(time);
  },
};

Time.init();
