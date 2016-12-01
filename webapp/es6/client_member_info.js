let Main = {
  customersId: '',
  urlPath: '',
  page: 1,
  count: 1,
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

    Main.pageNumEvent();

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
            data[i].attributes['created_at'] = moment(data[i].attributes['created-at']).format('YYYY-MM-DD HH:mm');
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
  getTrainings: (id, page) => {
    page = page || 1;

    $.ajax({
      url: '/api/admin/customers/' + id +'/trainings' + "?page=" + page,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log('getTrainings', result);
        if(result.data){
          let data = result.data;
          let weekArr = [' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六', ' 周日'];

          for(let i =0, lg = data.length; i<lg; i++){
            let theDate = moment(data[i].attributes['start-time']);
            data[i].attributes['updated_at'] = moment(data[i].attributes['updated-at']).format('YYYY-MM-DD HH:mm');
            data[i].attributes['start_time'] = theDate.format('YYYY-MM-DD HH:mm') + weekArr[theDate.format('E') - 1];
          }

          let meta = result.meta;
          Main.page = meta["current-page"];
          Main.count = meta["total-pages"];
          $('.js-page').text(Main.page);

          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_training_block',
            boxSelector: '.training-container',
            data: result.data
          });
        }
      }
    });
  },
  pageNumEvent: () => {
    let id = Main.customersId;
    $('.js-pagination').on('click', '.js-first', function(){
      console.log('first');
      if(Main.page != 1){
        Main.getTrainings(id, 1);
      }
    }).on('click', '.js-prev', function(){
      console.log('prev');
      if(Main.page > 1){
        Main.page -= 1;

        Main.getTrainings(id, Main.page);
      }
    }).on('click', '.js-next', function(){
      console.log('next');
      if(Main.page < Main.count){
        Main.page += 1;

        Main.getTrainings(id, Main.page);
      }
    }).on('click', '.js-last', function(){
      console.log('last');
      if(Main.page != Main.count){
        Main.getTrainings(id, Main.count);
      }
    });
  },
};
(function(){
  Main.init();
})();
