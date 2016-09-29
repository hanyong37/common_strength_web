const Main = {
  init: ()=>　{
    Main.getCourseType();
  },
  getCourseType: ()=> {
    $.ajax({
      url: '/api/courseType/getCourseTypesInfo',
      data: {
        currentPage: 0,
        pageSize: 10,
        keyword: ''
      },
      type: 'get',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        if (result.code == 1) {

        }
      }
    })
  }
};

(function() {
  Main.init();
})();
