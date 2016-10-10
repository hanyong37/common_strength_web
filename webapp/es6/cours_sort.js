const Main = {
  init: ()=>　{
    Main.getCourseType();
  },
  getCourseType: ()=> {
    $.ajax({
      url: '/api/courseType/getCourseTypesInfo',
      data: {
        currentPage: 0,
        pageSize: 10,
        keyword: ''
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {
          var data = result.data;
          for(let i = 0, lg = data.length; i < lg; i++){
            console.log(data[i].typeId);
            const typeId = data[i].typeId.toString();
            const typeName = data[i].typeName;
            const code = JSON.stringify({
              typeId,
              typeName,
            });
            data[i].typeCode = csTools.base64encode(csTools.utf16to8(code));
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
      Main.deleteCourseType(id);
    });
  },
  editCourseType: (code) => {
    location.href = '/courseSortAdd#code=' + code;
  },
  deleteCourseType: (id) => {
    $.ajax({
      url: '/api/courseType/deleteCourseTypeInfo',
      type: 'post',
      dataType: 'json',
      data: {
        typeId: id,
      },
      success: (result) => {
        if (result.code == 1) {
          csTools.msgModalShow({
            msg: '删除课程分类成功！'
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
