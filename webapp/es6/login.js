
const Main = {
  init: () => {
    Main.formValidate();
    $('.btn-login').on('click', () => {
      Main.loginTo();
    });

    let _$input = $('#productForm input');
    _$input.on('keypress', function(e){
      if(e.keyCode == 13){
        let _selfIndex = _$input.index(this);
        if(_selfIndex < _$input.length - 1){
          _$input.eq(_selfIndex + 1).focus();
        }else{
          Main.loginTo();
        }
      }
    });
  },
  loginTo: ( )=> {
    var data = $('#productForm').data('bootstrapValidator');
    if (data) {
      // 修复记忆的组件不验证
      data.validate();
      if (!data.isValid()) {
        console.log('action error');
        return false;
      }
    }

    console.log('action success');
    let userName = $.trim($('.input-username').val());
    let password = $.trim($('.input-password').val());

    $.ajax({
      url: '/api/admin/sessions',
      type: 'POST',
      dataType: 'json',
      data: {
        'user[full_name]': userName,
        'user[password]': password
      },
      success: (result) => {
        console.log(result);
        if(result.data){
          sessionStorage.userToken = result.data.attributes.token;
          location.href = 'storeManage';
        }else{
          $('.modal-alert').modal();
          Main.addValidateError('.input-username');
          Main.addValidateError('.input-password');
        }
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 401){
          $('.modal-alert').modal();
          Main.addValidateError('.input-username');
          Main.addValidateError('.input-password');
        }
      }
    });
  },
  addValidateError: (selector) => {
    $(selector).parent('.form-group').removeClass('has-success').addClass('has-error')
      .find('.glyphicon').removeClass('glyphicon-ok').addClass('glyphicon-remove');
  },
  formValidate: () => {
    $('#productForm').bootstrapValidator({
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        username: {
          validators: {
            notEmpty: {
              message: '用户名不能为空'
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: '密码不能为空'
            }
          }
        },
      }
    }).on('success.form.bv', (e) => {
      // Prevent form submission
      e.preventDefault();
    });
  }
};

(function(){
  Main.init();
})();
