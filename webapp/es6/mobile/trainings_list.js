const Main = {
  page: 1,
  numValue: 10,
  init: () => {
    Main.getTrainings();

  },
  slideEvent: () => {
    var $domList = $('.cs-list');
    for(let i = 0, lg = $domList.length; i < lg; i++){
      (function(i, Dom){
        let x, y,x1,y1, dx, isTrue = true, isEnd = false;
        var isCancel = $(Dom).find('.cancel-em').hasClass('cancel-true');
        var isCanceled = $(Dom).find('.canceled-em').hasClass('cancel-true');
        if(isCancel || isCanceled){
          if(isCanceled){
            $(Dom).find('.cs-del').addClass('cs-rebook').text('重新预约');
          }
          if(isCancel){
            $(Dom).find('.cs-del').addClass('cs-cancel');
          }
          Dom.addEventListener('touchstart', function(e){
            x = e.targetTouches[0].screenX;
            y = e.targetTouches[0].screenY;
            console.log('1', $(e.target).hasClass('cs-del'));
            let tId = this.getAttribute('data-id');

            if($(e.target).hasClass('cs-cancel')){
              isTrue = false;
              CS.msgConfirmShow({
                msg: '确定取消该课程？',
                title: '提示',
                style: 'weui',
                isPhone: 'ios',
                btn: ['取消', '确定'],
                callback: ()=>{
                  Main.delEvent(tId);
                }
              });
            }else if($(e.target).hasClass('cs-rebook')){
              isTrue = false;
              CS.msgConfirmShow({
                msg: '确定重新预约该课程？',
                title: '提示',
                style: 'weui',
                isPhone: 'ios',
                btn: ['取消', '确定'],
                callback: ()=>{
                  Main.rebookTrainings(tId);
                }
              });
            }else{
              isTrue = true;
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
              let oldLf = parseInt(this.getAttribute('data-left'));
              dx = !oldLf ? 0 : oldLf;
            }
          });
          Dom.addEventListener('touchmove', function(e){
            if(isTrue){
              x1 = e.targetTouches[0].screenX;
              y1 = e.targetTouches[0].screenY;
              let diff = x1 - x;
              let err = y1 - y;
              if(err <= 80){
                let change = diff + dx;
                if(change < -100){
                  change = -100;
                  this.setAttribute('data-left', change);
                  this.style.transform = 'translate('+ change +'px, 0)';
                  isEnd = false;
                }else{
                  this.setAttribute('data-left', change);
                  this.style.transform = 'translate('+ change +'px, 0)';
                  isEnd = true;
                }
              }else{
                this.setAttribute('data-left', '0');
                this.style.transform = 'translate('+ 0 +'px, 0)';
              }
            }

          });
          Dom.addEventListener('touchend', function(e){
            if(isEnd){
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }else{
              console.log('end show');
            }

          });
        }else{
          Dom.addEventListener('touchstart', function(){
            $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
          });
        }
      }(i, $domList[i]));
    }
  },
  getTrainings: () => {
    let page = Main.page;
    let numValue = Main.numValue;
    // 获取训练列表
    $.ajax({
      url: '/api/weixin/my_trainings/all?page='+ page +'&per_page='+ numValue ,
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
  },
  delEvent: (id) => {
    //cs-del
   console.log('cs-del', id);
    $.ajax({
      url: '/api/weixin/trainings/'+id,
      type: 'put',
      dataType: 'json',
      data: {
        'trainings[booking-status]': 'cancelled'
      },
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if(result.status == 403){
          CS.msgModalShow({
            msg: '该训练已无法取消，如需取消请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        }else if(result.status == 404){
          CS.msgModalShow({
            msg: '取消预约成功！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
              Main.getTrainings();
            }
          });
        }else{
          CS.msgModalShow({
            msg: '该训练可能已结束，详情请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        }
      }

    });
  },
  rebookTrainings: (id) => {
    $.ajax({
      url: '/api/weixin/trainings/'+id,
      type: 'put',
      dataType: 'json',
      data: {
        'trainings[booking-status]': 'booked'
      },
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if(result.status == 403){
          CS.msgModalShow({
            msg: '该训练已无法预约，如需预约请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        }else if(result.status == 404){
          CS.msgModalShow({
            msg: '预约课程成功！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
              Main.getTrainings();
            }
          });
        }else{
          CS.msgModalShow({
            msg: '该训练可能已结束，详情请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        }
      }

    });
  }
};


Main.init();
