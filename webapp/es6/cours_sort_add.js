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
    let _type = $('#j-type').val();
    let _id = $('#j-type').data('id');
    let _description = $('#j-description').val();
    if(!_type){
      csTools.msgModalShow({
        msg: '请输入课程分类信息！'
      });
      $("#j-save").on("click", function() {
        $("#j-save").off("click");
        Main.saveEvent();
      });
      return false;
    }
    Main.setCourseType({
      id: _id,
      val: _type,
      description: _description
    });
  },
  setCourseType: (a)=> {
    let ajaxUrl = '';
    let msgTop = '添加';
    let type = 'post';
    if(a.id){
      ajaxUrl = '/' + a.id;
      msgTop = '修改';
      type = 'put';
    }

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
      complete: (result) => {
        if(result.status == 201 || result.status == 200){
          csTools.msgModalShow({
            href: '/courseSort',
            msg: msgTop + '课程分类成功！',
            callback: () => {
              location.href = '/courseSort';
            }
          });
        }else{
          csTools.msgModalShow({
            msg: msgTop + '课程分类失败！'
          });
        }
        a = null;
        msgTop = null;
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
