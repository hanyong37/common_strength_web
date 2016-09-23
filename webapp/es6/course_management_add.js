const Main = {
  init: ()=> {
    $('.selectpicker').selectpicker({
      size: 4
    });

    $('.j-save').on('click', function() {
      Main.saveCourseInfo({
        courseId: '',
        courseName: '',
        typeId: '',
        courseStatus: '',
        storeId: '',
        courseDescription: ''
      });
    });
  },
  saveCourseInfo: (a)=> {
    $.ajax({
      url: '/api/course/insertCourseInfo',
      data: {
        courseId: a.courseId,
        courseName: a.courseName,
        typeId: a.typeId,
        courseStatus: a.courseStatus,
        storeId: a.storeId,
        courseDescription: a.courseDescription
      },
      type: 'get',
      dataType:　'json',
      success: function(result) {
        if (result.code == 1) {
          alert(result.message);
        }
      }
    })
  }
};

(function(){
  Main.init();
})();
