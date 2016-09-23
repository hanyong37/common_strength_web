const Main = {
  init: ()=> {
    $('.selectpicker').selectpicker({
      size: 4
    });

    $("#j-save").on('click', function() {
      Main.saveCourseInfo();
    });
  },
  saveCourseInfo: ()=> {
    var seeDay = $.trim($("#j-seeDay").val());
    var aboutDay = $.trim($("#j-aboutDay").val());
    var delDate = $.trim($("#j-delDate").val());
    var menNum = $.trim($("#j-menNum").val());
    var endDate = $.trim($("#j-endDate").val());

    $.ajax({
      url: '/api/rule/setCourseRule',
      data: {
        viewCourseDays: seeDay,
        reservationCourseDays: aboutDay,
        cancelCourseDatetime: delDate,
        allowLineDatetime: menNum,
        reservationDeadline: endDate
      },
      type: 'post',
      dataType: 'json',
      success: function(result) {
        console.log(result);
      }
    });
  }
}

(function() {
  Main.init();
})();
