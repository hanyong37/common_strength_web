
const Main = {
  init: () => {
    $('.select-member-type').selectpicker();
    $('.select-store').selectpicker();
    $('.end-date').datetimepicker({
      format: 'YYYY-MM-DD hh:mm'
    });
    Main.memberTypeChange();
    Main.formValidator();
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
  formValidator: () => {
    $('#productForm').bootstrapValidator({
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        memberShipName: {
          validators: {
            notEmpty: {
              message: '用户名称不能为空'
            }
          }
        },
        memberShipTelephone: {
          validators: {
            notEmpty: {
              message: '手机号码不能为空'
            },
            regexp: {
              regexp: /^1[34578]\d{9}$/,
              message: '手机号码格式不正确'
            }
          }
        },
        memberShipWechatId: {
          validators: {
            notEmpty: {
              message: '微信号不能为空'
            }
          }
        },
        deadLine: {
          validators: {
            notEmpty: {
              message: '截止时间不能为空'
            }
          }
        },
        residueDegree: {
          validators: {
            notEmpty: {
              message: '剩余次数不能为空'
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