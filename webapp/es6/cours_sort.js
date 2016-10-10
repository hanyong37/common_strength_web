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
          csTools.setNunjucksTmp({
            tmpSelector: '#tmp_course_sort',
            boxSelector: '.list-container',
            data: result.data,
            callback: ()=>{}
          });
        }
      }
    })
  },
  editCourseType: () => {

  },
  deleteCourseType: (id) => {
    $.ajax({
      url: '',
      type: 'post',
      dataType: 'json',
      data: {
        typeId: id,
      },
      success: (result) => {

      }
    });
  },
};

(function() {
  Main.init();
})();
