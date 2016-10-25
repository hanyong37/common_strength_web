let Main = {
  customersId: '',
  urlPath: '',
  init: () => {
    let Url = $.url();
    let code = Url.fparam('code');
    if(code){
      let id = csTools.utf8to16(csTools.base64decode(code));
      Main.customersId = id;
      Main.getCustomers(id);
    }else{
      location.href = 'clientList';
    }

    let path = Url.attr('path');
    Main.urlPath = path + '#code=' + code;

    Main.tabChange();
    let type = Url.fparam('type');
    if(type == 'unactive'){
      $('.tab-bar .tab-bar-block').eq(1).trigger('click');
    }else{
      $('.tab-bar .tab-bar-block').eq(0).trigger('click');
    }
  },
  tabChange: () => {
    let $tabBlock = $('.tab-bar .tab-bar-block');
    $tabBlock.on('click', function(){
      let index = $(this).index();
      let url = Main.urlPath;
      let id = Main.customersId;
      if(index == 0){
        url += '&type=active';
        Main.getTrainings(id);
      }else{
        url += '&type=unactive';
        Main.getOperations(id);
      }
      history.replaceState({ foo: 'bar'}, 'tab ' + index, url);
      $tabBlock.removeClass('active').eq(index).addClass('active');
      $('.tab-container .tab-container-block').hide().eq(index).show();
    });
  },
  getCustomers: (id) => {
    console.log(id);
    $.ajax({
      url: '/api/admin/customers/' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log(result);

        let attributes = result.data.attributes;

        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_member_info',
          boxSelector: '.js-member-info',
          data: attributes
        });

      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }else if(xhr.status == 404){
          location.href = 'clientList';
        }
      }
    });
  },
  getOperations: (id) => {
    $.ajax({
      url: '/api/admin/customers/' + id +'/operations',
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
            data.attributes['created-at'] = memont(data.attributes['created-at']).format('YYYY-MM-DD');
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_opt_block',
            boxSelector: '.opt-container',
            data: result.data
          });
        }
      }
    });
  },
  getTrainings: (id) => {
    $.ajax({
      url: '/api/admin/customers/' + id +'/trainings',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log('getTrainings', result);
        if(result.data){
          let data = result.data;
          for(let i =0, lg = data.length; i<lg; i++){
            data.attributes['updated_at'] = memont(data.attributes['updated_at']).format('YYYY-MM-DD');
          }

          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_training_block',
            boxSelector: '.training-container',
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
