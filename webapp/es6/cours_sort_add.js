const Main = {
  init: ()=>　{
    $("#j-save").on("click", function() {
      var _type = $('#j-type').val();
      console.log(_type);
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
          $('.js-modal-message').html('添加课程分类成功！');
          $('.js-btn-close').on('click', function(){
            location.href = 'courseSort';
          });
        }else{
          $('.js-modal-message').html('添加课程分类失败！');
        }
        $('#messageModal').modal();
      }
    })
  }
};

(function() {
  Main.init();
})();
