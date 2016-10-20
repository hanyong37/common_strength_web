
  const Main = {
    init: () => {
      Main.getStoreList();

      setTimeout(() => {
        $(".j-editStore").on('click', function() {
          let _id = $(this).parent().data('id');
          location.href = '/courserRulesOper?id=' + _id;
        })
      }, 200);

    },
    getStoreList: (a) => {
      $.ajax({
        url: '/api/admin/settings',
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
        success: function(result) {
          console.log(result);
          a.callback();
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
$(function() {
  Main.init();
});
