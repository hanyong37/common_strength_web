let Main = {
  urlPath: '',
  init: () => {
    let Url = $.url();
    let code = Url.fparam('code');
    if(code){
      code = eval("("+ csTools.utf8to16(csTools.base64decode(code)) +")");
      Main.getCustomers(code);
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
      if(index == 0){
        url += '&type=active';
      }else{
        url += '&type=unactive';
      }
      history.replaceState({ foo: 'bar'}, 'tab ' + index, url);
      $tabBlock.removeClass('active').eq(index).addClass('active');
      $('.tab-container .tab-container-block').hide().eq(index).show();
    });
  },
  getCustomers: (id) => {
    Main.customers = id;
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
        attributes.store_id = attributes['store-id'];
        attributes.store_name = attributes['store-name'];
        attributes.membership_type = attributes['membership-type'];
        attributes.membership_remaining_times = attributes['membership-remaining-times'];
        attributes.membership_duedate = attributes['membership-duedate'];

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
};
(function(){
  Main.init();
})();