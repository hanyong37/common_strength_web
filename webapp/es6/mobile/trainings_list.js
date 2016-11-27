
var hg =  window.innerHeight;
document.getElementsByClassName('weui-tab')[0].style.height = hg;

const Main = {
  page: 1,
  numValue: 10,
  isEnd: true,
  pageNum: null,
  myScroll: null,
  init: () => {
    Main.getTrainings(function(){
      Main.scrollEvent();
    });

  },
  slideEvent: () => {
    console.log('slideEvent');
    $('.em-btn-cancel').off('click').on('click', function () {
      let id = $(this).parents('.cs-list').data('id');
      CS.msgConfirmShow({
        msg: '确定取消该课程？',
        title: '提示',
        style: 'weui',
        isPhone: 'ios',
        btn: ['取消', '确定'],
        callback: () => {
          Main.delEvent(id);
        }
      });
    });
  },
  scrollEvent: function(){
      Main.myScroll = new IScroll('.cs-list-cell', {
        probeType: 2,
        bindToWrapper:true,
        resize: true,
        click: true
      });

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);  

      Main.myScroll.on('scroll', function() {
        console.log(this.maxScrollY);
        if(this.y < (this.maxScrollY - 90) && Main.isEnd && Main.page <= Main.pageNum) { // 上拉加载
          $('#loading').show();
          Main.page ++;
          Main.isEnd = false;
          
          setTimeout(function(){
            Main.getTrainings(function(){
                $('#loading').hide();
                Main.myScroll.refresh();
                Main.isEnd = true;
            });
          }, 800);
        }else{
          this.y = (this.maxScrollY - 90);
        }
      });
  },
  getTrainings: (callback) => {
    let page = Main.page;
    let numValue = Main.numValue;
    // 获取训练列表
    $.ajax({
      url: '/api/weixin/my_trainings/all?page=' + page + '&per_page=' + numValue,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': Wx.token,
      },
      success: (result) => {

        if (result.data) {
          let weekArr = [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六'];

          let data = result.data;
          for (let key in data) {
            let nWeek = new Date(data[key].attributes['start-time']).getDay();
            data[key].attributes['start-timeY'] = CS.setDateFormat({
              time: data[key].attributes['start-time'],
              format: 'yyyy-MM-dd'
            }) + weekArr[nWeek];
            data[key].attributes['start-timeH'] = CS.setDateFormat({
              time: data[key].attributes['start-time'],
              format: 'hh:mm'
            });
            data[key].attributes['end-timeH'] = CS.setDateFormat({
              time: data[key].attributes['end-time'],
              format: 'hh:mm'
            });
            data[key].attributes['int-start-time'] = new Date(data[key].attributes['start-time']).getTime();
            data[key].attributes['int-end-time'] = new Date(data[key].attributes['end-time']).getTime();
            data[key].attributes['int-now-time'] = new Date().getTime();
          }
          console.log(data);

          CS.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '#loading',
            isAppend: 'before',
            data,
            callback: () => {
              data = null;
              Main.slideEvent();
              
            }
          });


          Main.pageNum = result.meta['total-pages'];
          if(typeof callback === 'function'){
            callback();
          }
        }
      }
    })
  },
  delEvent: (id) => {
    //cs-del
    console.log('cs-del', id);
    $.ajax({
      url: '/api/weixin/trainings/' + id,
      type: 'delete',
      dataType: 'json',
      data: {
        'trainings[booking-status]': 'cancelled'
      },
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        if (result.status == 403) {
          CS.msgModalShow({
            msg: '该训练已无法取消，如需取消请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              Main.getTrainings();
            }
          });
        } else if (result.status == 200) {
          CS.msgModalShow({
            msg: '取消预约成功！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              Main.getTrainings();
            }
          });
        } else if (result.status == 409) {
          console.log('409',result);
          CS.msgModalShow({
            msg: '超过可取消时间，无法取消！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              Main.getTrainings();
            }
          });
        } else {
          CS.msgModalShow({
            msg: '该训练无法取消，详情请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              Main.getTrainings();
            }
          });
        }
      }

    });
  },
  rebookTrainings: (id) => {
    $.ajax({
      url: '/api/weixin/trainings/' + id,
      type: 'put',
      dataType: 'json',
      data: {
        'trainings[booking-status]': 'booked'
      },
      headers: {
        'X-Api-Key': Wx.token,
      },
      complete: (result) => {
        console.log(result.status);
        if (result.status == 403) {
          CS.msgModalShow({
            msg: '该训练已无法预约，如需预约请联系门店！',
            title: '提示',
            style: 'weui',
            isPhone: 'ios',
            callback: () => {
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        } else if (result.status == 200) {
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
        } else {
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
