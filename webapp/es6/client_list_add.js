
let Main = {
  customers: null,
  init: () => {
    $('.select-member-type').selectpicker();
    $('.select-store').selectpicker({
      size: 5,
      liveSearch: true
    });
    $('.end-date').datetimepicker({
      format: 'YYYY-MM-DD',
      stepping: 10
    }).change(function(e){
      // console.log(e.date);
    });
    $('#j-status').bootstrapSwitch();

    Main.getStoreList();
    Main.memberTypeChange();
    Main.formValidator();

    let code = $.url().fparam('code');
    if(code){
      code = eval("("+ csTools.utf8to16(csTools.base64decode(code)) +")");
      $('#status_switch').parents('.form-group').removeClass('hidden');
      Main.getCustomers(code);
    }

    $('.btn-save').on('click', function(){
      $('.btn-save').off('click');
      Main.addValidator();
    });

  },
  getStoreList: () => {
    $.ajax({
      url: '/api/admin/stores',
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {
        const data = result.data;
        if(!data){
          alert('请先添加门店!');
          return false;
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: 'select.select-store',
          data: data,
          callback: () => {
            $('.select-store').selectpicker('refresh');
          }
        });
      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }
      }
    });
  },
  getCustomers: (id) => {
    Main.customers = id;
    $.ajax({
      url: '/api/admin/customers/' + id,
      type: 'get',
      dataType: 'json',
      headers: {
        'X-Api-Key': csTools.token,
      },
      success: (result) => {

        let attributes = result.data.attributes;
        let memberType = attributes['membership-type'];
        if(memberType != 'time_card'){
          $('.form-dead-line').hide();
          $('.form-residue-degree').show();
        }

        $('[name=memberShipName]').val(attributes['name']);
        $('[name=memberShipTelephone]').val(attributes['mobile']);
        if(attributes['is-locked']){
          $("#j-status").bootstrapSwitch('state', false);
        }
        // $('[name=memberShipWechatId]').val(attributes['weixin']);
        $('.select-member-type').selectpicker('val', memberType);
        $('[name=deadLine]').val(attributes['membership-duedate']);
        $('[name=residueDegree]').val(attributes['membership-remaining-times']);
        $('.select-store').selectpicker('val', attributes['store-id']);

      },
      error: (xhr, textStatus, errorThrown) => {
        if(xhr.status == 403){
          location.href = 'login';
        }else if(xhr.status == 404){
          location.href = 'clientList';
        }
      }
    });
  },
  memberTypeChange: () => {
    const $memberType = $('.select-member-type');
    $memberType.on('changed.bs.select', () => {
      let memberType = $memberType.selectpicker('val');
      if(memberType == 'time_card'){
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
        // console.log('action error');
        return false;
      }
    }

    const getVal = Main.getInputValue;

    let memberShipId = Main.customers;
    let memberShipName = getVal('[name=memberShipName]');
    let memberShipTelephone = getVal('[name=memberShipTelephone]');
    // let memberShipWechatId = getVal('[name=memberShipWechatId]');
    let memberShipCardType = $('.select-member-type').selectpicker('val');
    let deadLine = getVal('[name=deadLine]');
    let residueDegree = getVal('[name=residueDegree]');
    let storeId = $('.select-store').selectpicker('val');
    let status = !$("#j-status").bootstrapSwitch('state');

    if(!storeId){
      alert('请先添加门店!');
      return false;
    }

    Main.postMemberShipsInfo(
      memberShipId,
      memberShipName,
      memberShipTelephone,
      // memberShipWechatId,
      memberShipCardType,
      deadLine,
      residueDegree,
      storeId,
      status
    );

  },
  getInputValue: (selector) => {
    return $.trim($(selector).val());
  },
  postMemberShipsInfo: (memberShipId,
                       memberShipName,
                       memberShipTelephone,
                       // memberShipWechatId,
                       memberShipCardType,
                       deadLine,
                       residueDegree,
                       storeId,
                       status ) => {

    if(!residueDegree){
      residueDegree = 0;
    }

    const memberShipWechatId = '';
    let data = {};
    if(memberShipCardType == 'time_card'){
      // deadLine = new Date(deadLine);
      data = {
        'customer[name]': memberShipName,
        'customer[mobile]':memberShipTelephone,
        // 'customer[weixin]':memberShipWechatId,
        'customer[membership_type]': memberShipCardType,
        'customer[membership_duedate]': deadLine,
        'customer[store_id]': storeId,
        'customer[is_locked]': status
      };
    }else {
      data = {
        'customer[name]': memberShipName,
        'customer[mobile]':memberShipTelephone,
        // 'customer[weixin]':memberShipWechatId,
        'customer[membership_type]': memberShipCardType,
        'customer[membership_remaining_times]': residueDegree,
        'customer[store_id]': storeId,
        'customer[is_locked]': status
      };
    }

    let _customerId = '';
    let ajaxType = 'POST';
    if(memberShipId){
      _customerId = memberShipId;
      ajaxType = 'PUT';
    }

    $.ajax({
      url: '/api/admin/customers/' + _customerId,
      type:  ajaxType,
      dataType: 'json',
      data: data,
      headers: {
        "X-Api-Key": csTools.token
      },
      complete: (result) => {
        console.log(result);
        if(result.status == 403){
          location.href = 'login';
          return false;
        }else if(result.status == 201){
          csTools.msgModalShow({
            msg:'添加会员成功！',
            href: 'clientList'
          });
        }else if(result.status == 200 && memberShipId){
          csTools.msgModalShow({
            msg:'更新会员成功！',
            href: 'clientList'
          });
        }else{
          let msg = '添加会员失败！';
          if(memberShipId){
            msg = '更新会员失败！';
          }
          csTools.msgModalShow({
            msg
          });
        }
        $('.btn-save').on('click', function(){
          $('.btn-save').off('click');
          Main.addValidator();
        });
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
