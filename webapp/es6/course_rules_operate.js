const Main = {
  init: ()=> {
    $('.selectpicker').selectpicker({
      size: 4
    });
    Main.getCourseInfo();
    $(".j-save").on('click', function() {
      let _self = $(this);
      let _key = _self.siblings('label').data('key');
      let _name = _self.siblings('label').text();
      let _text = _self.siblings('.col-sm-4').find('input').val();

      if (!/\d+/.test($.trim(_text))) {
        csTools.msgModalShow({
          msg: '请输入正确的 ' + _name + ' 规则!',
        });

        return false;
      }

      csTools.msgConfirmShow({
        msg: '确认修改 ' + _name + ' 为 ' + _text + ' 吗？',
        callback: () => {
          Main.saveCourseInfo({
            key: _key,
            value: _text
          });
        }
      })
    });
  },
  saveCourseInfo: (a) => {
    $.ajax({
      url: '/api/admin/settings/' +　a.key,
      data: {
        'setting[key]': a.key,
        'setting[value]': a.value
      },
      type: 'put',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      complete: function(result) {
        console.log(result);
        if(result.status == 200){
          csTools.msgModalShow({
            msg: '修改成功!',
          });
        }else{
          let txt = '';
          if(restult.responseText){
            txt = '错误原因：' + restult.responseText;
          }
          csTools.msgConfirmShow({
            msg: '修改失败!' + txt,
          });
        }
      }
    });
  },
  getCourseInfo: (a) => {
    $.ajax({
      url: '/api/admin/settings/',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: function (result) {
        console.log(result);
        if (result.data) {
          var Data = result.data;

          for (var key in Data) {
            for (let i = 0; i < Data.length; i++) {
            let labelKey = $('.form-horizontal label').eq(i).data('key');
              console.log(Data[key].attributes.key, labelKey);
              if (labelKey == Data[key].attributes.key ) {
                $('.col-sm-4 input').eq(i).val(Data[key].attributes.value);

              }
            }
          }
        }
      }
    })
  }
};

(function() {
  Main.init();
})();
