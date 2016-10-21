const Main = {
  init: ()=> {
    Main.__ajax();

  },
  __ajax: ()=> {
    $.ajax({
      url: '/api/admin/courses/',
      headers: {
        "X-Api-Key": csTools.token
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.data) {
          let data = result.data;
          for(let i = 0, lg = data.length; i < lg; i++){
            data[i].code = csTools.base64encode(csTools.utf16to8(data[i].id));

            data[i].attributes.store_id = data[i].attributes['store-id'];
            // data[i].attributes.store_name = data[i].attributes['store-name'];
            data[i].attributes.type_id = data[i].attributes['type-id'];
            // data[i].attributes.type_name = data[i].attributes['type-name'];
            data[i].attributes.default_capacity = data[i].attributes['default-capacity'];
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#temp',
            boxSelector: '.list-container',
            data,
            callback: ()=>{



            }
          });
        }
      }
    })
  },
  deleteCourse: (id) => {
    $.ajax({
      url: '/api/admin/courses/' + id,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        if (result.status == 204) {
          csTools.msgModalShow({
            msg: '删除课程成功！',
            callback: () => {
              Main.getCourseType();
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '删除课程失败！'
          });
        }
      }
    });
  },
};

(function(){
  Main.init();
})();
