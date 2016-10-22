
const Main = {
  init: () => {
    Main.getUserList();

    setTimeout(() => {
      // 编辑
      $(".j-editStore").on('click', function() {
        let _id = $(this).parent().data('id');
        location.href = '/adminListOper#id=' + _id;
      });

      // 删除
      $(".j-delStore").on("click", function() {
        let _id = $(this).parent().data('id');
        csTools.msgConfirmShow({
          msg: '确定删除该管理员吗？',
          callback: () => {
            Main.delUserInfo({
              id: _id
            })
          }
        });
      });

    },200);
  },
  getUserList: () => {
    $.ajax({
      url: '/api/admin/users/',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log(result);
        if (result.data) {
          csTools.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.content-text',
            isAppend: true,
            data: result.data
          });
        }
      }
    });
  },
  delUserInfo: (a) => {
    $.ajax({
      url: '/api/admin/users/' + a.id,
      data: {
        id: a.id
      },
      type: 'delete',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      complete: (result) => {
        if (result.status == 204) {
          csTools.msgModalShow({
            msg: '删除管理员成功!'
          });
        } else {
          csTools.msgModalShow({
            msg: '删除管理员信息失败!'
          });
        }
      }
    })
  }
};

(function() {
  Main.init();
})();
