const Main = {
  init: () => {
    $('.selectpicker').selectpicker({
      size: 5
    });
    $('#select_store_add').selectpicker({
      size: 5,
      liveSearch: true
    });
    var $startDatetime = $('.start_datetime');
    var $overDatetime = $('.over_datetime');
    $startDatetime.datetimepicker({
      format: 'YYYY-MM-DD hh:mm'
    });
    $overDatetime.datetimepicker({
      format: 'YYYY-MM-DD hh:mm',
      useCurrent: false
    });
    $startDatetime.on("dp.change", function (e) {
      $overDatetime.data("DateTimePicker").minDate(e.date);
    });

    $('.select-store').on('change', function () {
      $('.c-c-info').removeClass('box-hidden');
    });

    Main.getStoreList();
    $('.js-btn-save').on('click', function(){
      Main.saveCourseSchedule();
    });
  },
  saveCourseSchedule: () => {
    const getVal = Main.getInputValue;
    let storeId = $('#select_store_add').selectpicker('val');
    let startTime = getVal('#start_datetime');
    let endTime = getVal('#over_datetime');
    let capacity = getVal('#course_number');
    let courseId = $('#select_course').selectpicker('val');

    $.ajax({
      url: '/api/schedule/insertCourseSchedule ',
      type: 'post',
      dataType: 'json',
      data: {
        storeId,
        courseId,
        startTime,
        endTime,
        capacity,
      },
      success: (result) => {
        console.log(result);
      }
    });
  },
  getInputValue: (selector) => {
    return $.trim($(selector).val());
  },
  getStoreList: () => {
    $.ajax({
      url: '/api/store/getStoresInfo',
      type: 'get',
      dataType: 'json',
      data: {
        currentPage: 0,
        pageSize: 1,
        keyword: '',
      },
      success: (result) => {
        console.log('getStoresInfo', result);
        const dataArr = result.data;
        if(dataArr.length <= 0){
          alert('请先添加门店!');
          return false;
        }
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: 'select#select_store_add',
          data: dataArr,
          callback: () => {
            $('#select_store_add').selectpicker('refresh');
          }
        });
      }
    });
  },
};

$(function(){
 Main.init();
});