const Main = {
  init: ()=>　{
    Main.getCourseType();
  },
  getCourseType: ()=> {
    $.ajax({
      url: '/api/admin/course_types',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: function(result) {
        let data = result.data;
        if (data) {
          for(let i = 0, lg = data.length; i < lg; i++){
            const typeId = data[i].id.toString();
            const typeName = data[i].attributes.name;
            const description = data[i].attributes.description;
            const code = JSON.stringify({
              typeId,
              typeName,
              description
            });
            data[i].typeCode = encodeURIComponent(csTools.utf16to8(code));
          }
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_course_sort',
            boxSelector: '.list-container',
            data,
            callback: ()=>{
              Main.eventBind();
            }
          });
        }
      }
    })
  },
  eventBind: () => {
    $('.js-btn-del').on('click', function(){
      var id = $(this).data('id');
      csTools.msgConfirmShow({
        msg: '确认删除课程?',
        callback: () => {
          Main.deleteCourseType(id);
        }
      });
    });
  },
  editCourseType: (code) => {
    location.href = 'courseSortAdd#code=' + code;
  },
  deleteCourseType: (id) => {
    $.ajax({
      url: '/api/admin/course_types/' + id,
      type: 'DELETE',
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        if (result.status == 204) {
          csTools.msgModalShow({
            msg: '删除课程分类成功！',
            callback: () => {
              Main.getCourseType();
            }
          });
        }else{
          csTools.msgModalShow({
            msg: '删除课程分类失败！'
          });
        }
      }
    });
  },
};

(function() {
  Main.init();
})();
