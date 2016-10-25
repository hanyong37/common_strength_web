const Main = {
  init: () => {
    Main.getClientCardList();
  },
  getClientCardList: () => {
    $.ajax({
      url: '/api/admin/operations',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token
      },
      success: function(result){
        console.log(result);
        if(result.data){
          // csTools.setNunjucksTmp({
          //   tmpSelector: '',
          //   boxSelector: '',
          //   data: result.data,
          //   callback: () => {
          //
          //   }
          // });
        }

      }
    });
  },

};

(function(){
  Main.init();
})();
