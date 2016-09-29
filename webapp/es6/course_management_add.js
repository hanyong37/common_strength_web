const Main = {
  init: ()=> {
    $('.selectpicker').selectpicker({
      size: 4
    });

    $('#j-save').on('click', function() {
      var cont = $("#j-cont").val();
      var type = $("#j-type").val();
      var status = $("#j-status").val();
      var store = $("#j-store").val();
      var text = $("#j-text").val();

      Main.saveCourseInfo({
        courseId: '',
        courseName: cont,
        typeId: type,
        courseStatus: status,
        storeId: store,
        courseDescription: text
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
