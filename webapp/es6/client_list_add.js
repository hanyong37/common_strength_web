
const Main = {
  init: () => {
    $('.select-member-type').selectpicker();
    $('.select-store').selectpicker();
    Main.memberTypeChange();
  },
  memberTypeChange: () => {
    const $memberType = $('.select-member-type');
    $memberType.on('changed.bs.select', () => {
      let memberType = $memberType.selectpicker('val');
      if(memberType == '时间卡'){
        $('.form-dead-line').slideDown();
        $('.form-residue-degree').slideUp();
      }else{
        $('.form-dead-line').slideUp();
        $('.form-residue-degree').slideDown();
      }
    });
  },
  form: () => {
    $('#productForm').bootstrapValidator({
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        username: {
          validators: {
            notEmpty: {
              message: '用户名不能为空'
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: '密码不能为空'
            }
          }
        },
      }
    }).on('success.form.bv', (e) => {
      // Prevent form submission
      e.preventDefault();
    });
  },
  getMemberShipsInfo: (memberShipId,
                       memberShipName,
                       memberShipTelephone,
                       memberShipWechatId,
                       memberShipCardType,
                       deadLine,
                       residueDegree,
                       storeId ) => {
    $.ajax({
      url: '/api/member/insertMemberShipsInfo',
      type: 'post',
      dataType: 'json',
      data: {
        memberShipId,
        memberShipName,
        memberShipTelephone,
        memberShipWechatId,
        memberShipCardType,
        deadLine,
        residueDegree,
        storeId
      },
      success: (result) => {
        console.log(result);
      }
    });
  },
};
(function(){
  Main.init();
})();