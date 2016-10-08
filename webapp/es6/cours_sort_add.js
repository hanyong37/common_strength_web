const Main = {
  init: ()=>　{
    $("#j-save").on("click", function() {
      var _type = $('#j-type').val();
      Main.getCourseType({
        val: _type
      });
    });
  },
  getCourseType: (a)=> {
    $.ajax({
      url: '/api/courseType/insertCourseTypeInfo',
      data: {
        typeId: '',
        typeName: a.val
      },
      type: 'post',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {

        }
      }
    })
  }
};

(function() {
  Main.init();
})();
