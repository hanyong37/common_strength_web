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
      if ($.trim(_text) == "") {
        csTools.msgModalShow({
          msg: _name + '不能为空!',
        });

        return false;
      }

      csTools.msgConfirmShow({
        msg: '确认修改' + _name + '为' + _text + '吗？',
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
      success: function(result) {
        console.log(result);
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
            for (let i = 0; i < 4; i++) {
            let labelKey = $('.form-horizontal label').eq(i).data('key');
              console.log(Data[key].attributes.key, labelKey);
              if (Data[key].attributes.key == labelKey ) {
                console.log(Data[key].attributes.value)
                $('.col-sm-4 input').eq(key).val(Data[key].attributes.value);
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
