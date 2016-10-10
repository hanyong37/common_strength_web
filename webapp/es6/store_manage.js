$(function() {
  const Main = {
    init: () => {
      Main.getStoreList({
        currentPage: 1,
        pageSize: 10,
        keyword: '',
        ft: true
      });

      setTimeout(() => {
        $(".j-delStore").on('click', function() {
          console.log(1);
          var _this = $(this);
          Main.delStoreList({
            id: _this.parent().data("id"),
            callback: () => {
              _this.parents(".content-table").remove();
            }
          });
        });


        $(".editStore").on('click', function() {

        })
      }, 200);

    },
    getStoreList: (a) => {
      $.ajax({
        url: '/api/store/getStoresInfo',
        type: 'get',
        dataType: 'json',
        data: {
          currentPage: a.currentPage,
          pageSize: a.pageSize,
          keyword: a.keyword
        },
        success: function(result){
          if(result.code == 1) {
            $(".content-table:not(.title)").remove();
            Main.setNunjucksTmp({
              tmpSelector: $("#temp"),
              boxSelector: $('#j-html'),
              isAppend: "before",
              data: {
                data: result.data
              }
            });

            var pageNum = result.totalPage;
            if (a.ft) {
              csTools.setPagination({
                pageNum: 3,
                pageCallback: (_index) => {
                  Main.getStoreList({
                    currentPage: _index,
                    pageSize: 10,
                    keyword: '',
                    ft: false
                  });
                },
                upCallback: () => {
                  
                }
              });
            }
          }
        }
      });
    },
    delStoreList: (a) => {
      $.ajax({
        url: '/api//store/deleteStoreInfoByStoreId',
        type: 'get',
        dataType: 'json',
        data: {
          storeId: a.id
        },
        success: function(result) {
          if (result.code == 1) {
            console.log(result);
            a.callback();
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
