const Main = {
  init: ()=>　{
    let code = $.url().fparam('code');
    if(code){
      code = eval("("+ csTools.base64decode(code) +")");
      console.log('code1', code);
      const typeName = code.typeName;
      $('#j-type').val(typeName).data('id', code.typeId);
    }
    $("#j-save").on("click", function() {
      var _type = $('#j-type').val();
      var _id = $('#j-type').data('id');
      console.log(_type);
      Main.getCourseType({
        id: _id,
        val: _type
      });
    });
  },
  getCourseType: (a)=> {
    let typeId = 3;
    let ajaxUrl = 'insertCourseTypeInfo';
    if(a.id){
      ajaxUrl = 'updateCourseTypeInfo';
      typeId = a.id;
    }
    $.ajax({
      url: '/api/courseType/' + ajaxUrl,
      data: {
        typeId: typeId,
        typeName: a.val
      },
      type: 'post',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {
          csTools.msgModalShow({
            href: '/courseSort',
            msg: '添加课程分类成功！'
          });
        }else{
          csTools.msgModalShow({
            msg: '添加课程分类失败！'
          });
        }
      }
    })
  }
};

(function() {
  Main.init();
})();
