const Main = {
  page: 1,
  numValue: 10,
  init: () => {
    Main.getTrainings();

  },
  slideEvent: () => {
    $('.em-btn-cancel').on('click', function () {
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
  getTrainings: () => {
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
          let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];



          let data = result.data;
          for (let key in data) {
            let nWeek = new Date(data[key].attributes['start-time']).getDay();

            let tWeek = weekArr[nWeek];
            data[key].attributes['start_date'] = CS.setDateFormat({time: data[key].attributes['start-time'], format: 'yyyy-MM-dd '}) + tWeek;

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
          $(".cs-list-cell .cs-list").remove();

          CS.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.cs-list-cell',
            isAppend: 'append',
            data,
            callback: () => {
              data = null;
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
      url: '/api/weixin/trainings/' + id,
      type: 'put',
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
              $('.cs-list').css('transform', 'translate(0, 0)').attr('data-left', 0);
            }
          });
        } else if (result.status == 200) {
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
