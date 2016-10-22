
const Main = {
  init: () => {
    let url_id = $.url().fparam('id');
    let _type = 'put';
    if (url_id == undefined) {
      url_id = "";
      _type = 'post';
    } else {
      $(".display-show").hide();
    }
    console.log(url_id);
    $('#j-save').on('click', function() {
      var _name = $.trim($("#j-name").val());
      var _password = $.trim($("#j-psw").val());
      if (_name == "") {
        csTools.msgModalShow({
          msg: '请设置管理员账户!'
        });
        return false;
      }

      if (_password == "") {
        csTools.msgModalShow({
          msg: '请设置管理员密码!'
        });
        return false;
      }
      csTools.msgConfirmShow({
        msg: '确定保存管理员信息吗？',
        callback: () => {
          Main.insertUserInfo({
            id: url_id,
            name: _name,
            password: _password,
            type: _type
          });
        }
      });
    });
  },
  insertUserInfo: (a) => {
    $.ajax({
      url: '/api/admin/users/' + a.id,
      data: {
        'user[name]': a.name,
        'user[password]': a.password
      },
      type: a.type,
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      complete: function(result) {
        console.log(result);
        if (result.status == 200 || result.status == 201) {
          csTools.msgModalShow({
            msg: '管理员信息保存成功!'
          });
        } else {
          csTools.msgModalShow({
            msg: '管理员信息保存失败!'
          });
        }

        if (result.status == 422) {
          csTools.msgModalShow({
            msg: '管理员信息验证失败!'
          });
        }
      }
    });
  }
};

(function() {
  Main.init();
})();
