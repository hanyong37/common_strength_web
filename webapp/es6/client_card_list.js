const Main = {
  init: () => {
    Main.getOperations();
  },
  getOperations: () => {
    $.ajax({
      url: '/api/admin/operations',
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
            data[i].attributes['created_at'] = moment(data[i].attributes['created-at'].slice(0,-1)).format('YYYY-MM-DD HH:mm');
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_opt_block',
            boxSelector: '.list-box',
            data: result.data
          });
        }
      }
    });
  },

};

(function(){
  Main.init();
})();
