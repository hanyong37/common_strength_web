const Main = {
  init: () => {
    Main.getTrainings({
      page: 1,
      numValue: 10
    });

  },
  slideEvent: () => {
    var $domList = $('.cs-list');
    for(let i = 0, lg = $domList.length; i < lg; i++){
      (function(i, Dom){
        let x, y,x1,y1, dx;
        Dom.addEventListener('touchstart', function(e){
          $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
          x = e.targetTouches[0].screenX;
          y = e.targetTouches[0].screenY;
          let oldLf = parseInt(this.getAttribute('data-left'));
          dx = !oldLf ? 0 : oldLf;
        });
        Dom.addEventListener('touchmove', function(e){
          x1 = e.targetTouches[0].screenX;
          y1 = e.targetTouches[0].screenY;
          let diff = x1 - x;
          let err = y1 - y;
          let change = diff + dx;
          if(change < -100){
            change = -100;
          }else if(change > 0){
            change = 0;
          }
          this.setAttribute('data-left', change);
          this.style.transform = 'translate('+ change +'px, 0)';
        });
        Dom.addEventListener('touchend', function(e){
          console.log(x,y,x1,y1);
        });
      }(i, $domList[i]));
    }
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
            data: result.data,
            callback: () => {
              Main.slideEvent();
            }
          });

        }
      }
    })
  }
};


Main.init();
