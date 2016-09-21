
const Main = {
  init: () => {
    $('.selectpicker').selectpicker({
      size: 4
    });
  },
  saveStoreInfo: () => {
    var uname = $.trim($('.input-username').val());
    var pwd = $.trim($('.input-password').val());

  },
};

(function(){
  Main.init();
})();