const Main = {
  init: ()=>　{
    let code = $.url().fparam('code');
    if(code){
      code = eval("("+ csTools.utf8to16(decodeURIComponent(code)) +")");
      console.log('code1', code);
      const typeName = code.typeName;
      const description = code.description;
      $('#j-type').val(typeName).data('id', code.typeId);
      $('#j-description').val(description);
    }
    $("#j-save").on("click", function() {
      $("#j-save").off("click");
      Main.saveEvent();
    });
  },
  saveEvent: () => {
    var _type = $('#j-type').val();
    var _id = $('#j-type').data('id');
    var _description = $('#j-description').val();
    console.log(_type);
    Main.setCourseType({
      id: _id,
      val: _type,
      description: _description
    });
  },
  setCourseType: (a)=> {
    /* FIXME typeId需要动态生成，这里等待接口更改 */
    let ajaxUrl = '';
    let msgTop = '添加';
    let type = 'post';
    if(a.id){
      ajaxUrl = '/' + a.id;
      msgTop = '修改';
      type = 'put';
    }
    console.log(ajaxUrl);
    $.ajax({
      url: '/api/admin/course_types' + ajaxUrl,
      data: {
        "course_type[name]": a.val,
        "course_type[description]": a.description
      },
      type,
      dataType: 'json',
      headers: {
        "X-Api-Key": csTools.token
      },
      success: function(result) {
        console.log(result);
        if (result.data) {
          csTools.msgModalShow({
            href: '/courseSort',
            msg: msgTop + '课程分类成功！'
          });
        }else{
          csTools.msgModalShow({
            msg: msgTop + '课程分类失败！'
          });
        }

      },
      complete: () => {
        $("#j-save").on("click", function() {
          $("#j-save").off("click");
          Main.saveEvent();
        });
      }
    })
  }
};

(function() {
  Main.init();
})();
