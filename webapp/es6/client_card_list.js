const Main = {
  page: 1,
  count: 1,
  init: () => {
    Main.getOperations(Main.page);
    Main.pageNumEvent();
  },

  getOperations: (page) => {
    $.ajax({
      url: '/api/admin/operations' + "?page=" + page,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log('getOperations', result);
        if(result.data){
          let data = result.data;
          for(let i =0, lg = data.length; i<lg; i++){
            data[i].attributes['created_at'] = moment(data[i].attributes['created-at']).format('YYYY-MM-DD HH:mm');
          }

        let meta = result.meta;
        Main.page = meta["current-page"];
        Main.count = meta["total-pages"];
        console.log(" Main.count", Main.count);

        $('.js-page').text(Main.page);
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_opt_block',
            boxSelector: '.list-box',
            data: result.data
          });
        }
      }
    });
  },

  pageNumEvent: () => {
    $('.js-pagination').on('click', '.js-first', function(){
      console.log('first');
      Main.getOperations(1);
    }).on('click', '.js-prev', function(){
      console.log('prev');
      if(Main.page > 1){
        Main.page -= 1;
        Main.getOperations(Main.page);
      }
    }).on('click', '.js-next', function(){
      console.log('next');
      if(Main.page < Main.count){
        Main.page += 1;
        Main.getOperations(Main.page);
      }
    }).on('click', '.js-last', function(){
      console.log('last');
      Main.getOperations(Main.count);
    });
  },


};

(function(){
  Main.init();
})();
