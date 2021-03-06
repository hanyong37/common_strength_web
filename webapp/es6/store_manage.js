$(function() {
  const Main = {
    init: () => {
      Main.getStoreList();

      setTimeout(() => {
        $(".j-delStore").on('click', function() {
          var _this = $(this);
          csTools.msgConfirmShow({
            msg: '确定删除门店吗!',
            callback: function() {
              Main.delStoreList({
                id: _this.parent().data("id")
              });
            }
          });
        });


        $(".j-editStore").on('click', function() {
          const _thisLi = $(this).parents('.content-table').find('li');
          const id = _thisLi.eq(0).data('id');
          const name = _thisLi.eq(1).html();
          const address = _thisLi.eq(2).html();
          const telphone = _thisLi.eq(3).html();
          let storeData = {
            id,
            name,
            address,
            telphone
          };

          console.log(storeData);
          storeData = JSON.stringify(storeData);

          location.href = '/storeManageAdd#data=' + encodeURIComponent(csTools.utf16to8(storeData));
        })
      }, 200);

    },
    getStoreList: (a) => {
      $.ajax({
        url: '/api/admin/stores',
        type: 'get',
        dataType: 'json',
        headers: {
          'X-Api-Key': csTools.token,
        },
        success: function(result){
          console.log(result);
          Main.setNunjucksTmp({
            tmpSelector: $("#temp"),
            boxSelector: $('.content-text'),
            isAppend: "append",
            data: {
              data: result.data
            }
          });
        }
      });
    },
    delStoreList: (a) => {
      $.ajax({
        url: '/api/admin/stores/' + a.id,
        type: 'DELETE',
        dataType: 'json',
        headers: {
          'X-Api-Key': csTools.token,
        },
        complete: function(result) {
          console.log(result);
          if(result.status == 204){
            csTools.msgConfirmShow({
              msg: '删除门店成功!',
              callback: function () {
                location.reload();
              }
            });
          }else{
            csTools.msgConfirmShow({
              msg: '删除门店失败!'
            });
          }
        }
      })
    },
    setNunjucksTmp: (options) => {
      const tpl_pay_template = $(options.tmpSelector).html();
      const html = nunjucks.renderString(tpl_pay_template, options.data);
      const index_container = $(options.boxSelector);
      if(options.isAppend == "append"){
        // 元素结尾
        index_container.append(html);
      } else if (options.isAppend == "prepend"){
        // 元素开头
        index_container.prepend(html);
      } else if (options.isAppend  == "before"){
        // 元素之前
        index_container.before(html);
      } else if (options.isAppend  == "after") {
        // 元素之后
        index_container.after(html);
      } else {
        index_container.html(html);
      }
    }
  };

  //http://123.207.151.199:8080/member/getMemberShipsInfo

  Main.init();
});
