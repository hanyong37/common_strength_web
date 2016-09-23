
const Main = {
  init: () => {
    $('.select-member-type').selectpicker();
    $('.select-store').selectpicker();
    $('.end-date').datetimepicker({
      format: 'YYYY-MM-DD',
      stepping: 10
    }).change(function(e){
      console.log(e.date);
    });


    // .on('changeDate', function(ev){
    //   var val = $(this).val();
    //   if (val){
    //     $(this).parents('.has-feedback').removeClass('has-error').addClass('has-success')
    //       .find('.form-control-feedback').removeClass('glyphicon-remove').addClass('glyphicon glyphicon-ok').show();
    //   }else{
    //     $(this).parent('.form-group').removeClass('has-success').addClass('has-error')
    //       .find('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon glyphicon-remove').show();
    //   }
    // })


    Main.memberTypeChange();
    Main.formValidator();

    $('.btn-save').on('click', function(){
      Main.addValidator();
    });
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
  addValidator: () => {
    var data = $('#productForm').data('bootstrapValidator');
    if (data) {
      // 修复记忆的组件不验证
      data.validate();
      if (!data.isValid()) {
        console.log('action error');
        return false;
      }
    }

    const getVal = Main.getInputValue;

    let memberShipId = '';
    let memberShipName = getVal('[name=memberShipName]');
    let memberShipTelephone = getVal('[name=memberShipTelephone]');
    let memberShipWechatId = getVal('[name=memberShipWechatId]');
    let memberShipCardType = $('.select-member-type').selectpicker('val');
    let deadLine = getVal('[name=deadLine]');
    let residueDegree = getVal('[name=residueDegree]');
    let storeId = $('.select-store').selectpicker('val');

    Main.postMemberShipsInfo(
      memberShipId,
      memberShipName,
      memberShipTelephone,
      memberShipWechatId,
      memberShipCardType,
      deadLine,
      residueDegree,
      storeId,
    );

  },
  getInputValue: (selector) => {
    return $.trim($(selector).val());
  },
  postMemberShipsInfo: (memberShipId,
                       memberShipName,
                       memberShipTelephone,
                       memberShipWechatId,
                       memberShipCardType,
                       deadLine,
                       residueDegree,
                       storeId ) => {

    if(!residueDegree){
      residueDegree = 0;
    }

    let data = $.toJSON({
      memberShipId,
      memberShipName,
      memberShipTelephone,
      memberShipWechatId,
      memberShipCardType,
      deadLine,
      residueDegree,
      storeId
    });
    console.log(data);

    $.ajax({
      url: '/api/member/insertMemberShipInfo',
      type: 'post',
      dataType: 'json',
      data: data,
      success: (result) => {
        console.log(result);
      }
    });
  },
  formValidator: () => {
    $('#productForm').bootstrapValidator({
      framework: 'bootstrap',
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
};
(function(){
  Main.init();
})();