let pageCurrent = 1;
let pageNumber = 10;
let pageCount = 1;
let filterText = '';
const Main = {
  init: () => {
    Main.getMemberShipsInfo(pageCurrent, pageNumber, filterText);
  },
  getMemberShipsInfo: (currentPage, pageSize, keyword) => {
    $.ajax({
      url: '/api/admin/customers',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        console.log(result);
        let data = result.data;
        for(let i = 0, lg = data.length; i < lg; i++){
          data[i].code = csTools.base64encode(csTools.utf16to8(data[i].id));

          data[i].attributes.store_id = data[i].attributes['store-id'];
          data[i].attributes.store_name = data[i].attributes['store-name'];
          data[i].attributes.membership_type = data[i].attributes['membership-type'];
          data[i].attributes.membership_remaining_times = data[i].attributes['membership-remaining-times'];
          data[i].attributes.membership_duedate = data[i].attributes['membership-duedate'];
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_client_list',
          boxSelector: '.list-box',
          data: result.data,
          callback: () => {

          }
        });
      }
    });
  },
};

(function(){
  Main.init();
})();