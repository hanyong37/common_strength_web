const Main = {
  init: ()=> {
    $('.select-store, .select-course-type').selectpicker({
      size: 5,
      liveSearch: true
    });

    $('#j-status').bootstrapSwitch();

    $('#j-save').on('click', function() {
      var cont = $("#j-cont").val();
      var type = $("#j-type").val();
      var status = $("#j-status").val();
      var store = $("#j-store").val();
      var text = $("#j-text").val();

      Main.saveCourseInfo({
        courseId: '',
        courseName: cont,
        typeId: type,
        courseStatus: status,
        storeId: store,
        courseDescription: text
      });
    });

    Main.getCourseTypeList();
    Main.getStoreList();
  },
  saveCourseInfo: (a)=> {
    $.ajax({
      url: '/api/course/insertCourseInfo',
      data: {
        courseId: a.courseId,
        courseName: a.courseName,
        typeId: a.typeId,
        courseStatus: a.courseStatus,
        storeId: a.storeId,
        courseDescription: a.courseDescription
      },
      type: 'post',
      dataType:　'json',
      success: function(result) {
        if (result.code == 1) {
          alert(result.message);
        }
      }
    })
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
        console.log(dataArr);
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_store',
          boxSelector: 'select.select-store',
          data: dataArr,
          callback: () => {
            $('.select-store').selectpicker('refresh');
          }
        });
      }
    });
  },
  getCourseTypeList: () => {
    $.ajax({
      url: '/api/courseType/getCourseTypesInfo',
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
          alert('请先添加课程分类!');
          return false;
        }
        console.log(dataArr);
        csTools.setNunjucksTmp({
          tmpSelector: '#tmp_select_ctype',
          boxSelector: 'select.select-course-type',
          data: dataArr,
          callback: () => {
            $('.select-course-type').selectpicker('refresh');
          }
        });
      }
    });
  },
};

(function(){
  Main.init();
})();
