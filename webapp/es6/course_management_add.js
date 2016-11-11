const Main = {
  id: '',
  init: ()=> {

    $('.select-course-type').selectpicker({
      size: 5,
      liveSearch: true
    });

    Main.getCourseTypeList();
    Main.getStoreList();

    let code = $.url().fparam('code');
    let id = '';
    if(code){
      Main.id = id = eval("("+ csTools.utf8to16(csTools.base64decode(code)) +")");
      Main.getCourse(id);
      $('.select-store').attr('disabled', 'disabled');
    }

    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    });

    $('#j-status').bootstrapSwitch();
    $('#j-save').on('click', function() {
      $('#j-save').off('click');

      Main.saveCourseEvent();
    });

  },
  saveCourseEvent: () => {
    let cont = $("#j-cont").val();
    let type = $("#j-type").val();
    let status = $("#j-status").bootstrapSwitch('state');
    let store = $("#j-store").val();
    let text = $("#j-text").val();
    let defaultCapacity = $('#default_capacity').val();

    let courseStatus = 'active';
    if(!status){
      courseStatus = 'inactive';
    }
    Main.saveCourseInfo({
      courseId: Main.id,
      courseName: cont,
      typeId: type,
      courseStatus,
      storeId: store,
      courseDescription: text,
      defaultCapacity,
    });
  },
  getCourse: (id) => {
    $.ajax({
      url: '/api/admin/courses/' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: (result) => {
        if(result.data){
          let data = result.data;

          let name = data.attributes.name;
          let status = data.attributes.status;
          let typeId = data.attributes['type-id'];
          let storeId = data.attributes['store-id'];
          let defaultCapacity = data.attributes['default-capacity'];
          let description = data.attributes.description;

          if(status == 'active'){
            status = true;
          }else{
            status = false;
          }
          $("#j-cont").val(name);
          $(".select-course-type").selectpicker('val', typeId);
          console.log(status);
          $("#j-status").bootstrapSwitch('state', status);
          $(".select-store").selectpicker('val', storeId);
          $("#j-text").val(description);
          $('#default_capacity').val(defaultCapacity);

        }
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }else if(xhr.status == 404) {
          location.href = 'courseManagement';
        }
      }
    });
  },
  saveCourseInfo: (a)=> {

    let msgTop = '添加';
    let type = 'post';
    if(a.courseId){
      msgTop = '修改';
      type = 'put';
    }

    $.ajax({
      url: '/api/admin/courses/' + a.courseId,
      data: {
        "course[name]": a.courseName,
        "course[type_id]": a.typeId,
        "course[status]": a.courseStatus,
        "course[store_id]": a.storeId,
        "course[description]": a.courseDescription,
        "course[default_capacity]": a.defaultCapacity
      },
      type,
      dataType:　'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: function(result) {
        console.log(result);
        if (result.data) {
          csTools.msgModalShow({
            href: '/courseManagement',
            msg: msgTop + '课程成功！'
          });
        }else{
          csTools.msgModalShow({
            msg: msgTop + '课程失败！'
          });
        }
        $('#j-save').on('click', function() {
          $('#j-save').off('click');
          Main.saveCourseEvent();
        });
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }
        $('#j-save').on('click', function() {
          $('#j-save').off('click');
          Main.saveCourseEvent();
        });
      }
    })
  },
  getStoreList: () => {
    $.ajax({
      url: '/api/admin/stores',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        const data = result.data;
        if(!data){
          alert('请先添加门店!');
          return false;
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: 'select.select-store',
          data: data,
          callback: () => {
            $('.select-store').selectpicker('refresh');
          }
        });
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }
      }
    });
  },
  getCourseTypeList: () => {
    $.ajax({
      url: '/api/admin/course_types',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: function(result) {
        console.log(result);
        let data = result.data;
        if(data.length <= 0){
          alert('请先添加课程分类!');
          return false;
        }
        if (data) {
          for(let i = 0, lg = data.length; i < lg; i++){
            console.log(data[i].id);
            const typeId = data[i].id.toString();
            const typeName = data[i].attributes.name;
            const description = data[i].attributes.description;
            const code = JSON.stringify({
              typeId,
              typeName,
              description
            });
            data[i].typeCode = csTools.base64encode(csTools.utf16to8(code));
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_select_ctype',
            boxSelector: 'select.select-course-type',
            data,
            callback: () => {
              $('.select-course-type').selectpicker('refresh');
            }
          });
        }
      }
    });
  },
};

(function(){
  Main.init();
})();
