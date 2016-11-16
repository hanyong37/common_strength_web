$(function(){
  var Main = {
    init: ()=> {
      var data = [
        {name: 'Microsoft Internet Explorer', value: 56.33 },
        {name: 'Chrome', value: 24.03},
        {name: 'Firefox', value: 10.38},
        {name: 'Safari',  value: 4.77},
        {name: 'Opera', value: 0.91},
        {name: 'Proprietary or Undetectable', value: 0.2}
      ];
      // Main.BindHoverEvent();
      // Main.BindChartEvent(data);
      Main.getCountClientInfo();
    },
    BindHoverEvent: ()=>{
      $("a.kcph").hover(function(){
        var _self = $(this);
        var html = '<div class="chart-tmp">'
                +'<h4 class="tmp-left">课程偏好统计</h4>'
                +'<canvas id="myChart" width="400" height="400"></canvas>'
                +'</div>';
        _self.parent('li').append(html);
      },function(){
        console.log($(this).siblings('.chart-tmp'));

        $(this).siblings('.chart-tmp').remove();
      })
    },
    BindChartEvent: (data)=> {
      var Stat = G2.Stat;
      var chart = new G2.Chart({
        id: 'c1',
        width: 200,
        height: 200
      });
      chart.source(data);
      // 重要：绘制饼图时，必须声明 theta 坐标系
      chart.coord('theta', {
        radius: 0.8 // 设置饼图的大小
      });
      chart.legend('name', {
        position: 'bottom'
      });
      chart.intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent',function(name, percent){
        percent = (percent * 100).toFixed(2) + '%';
        return name + ' ' + percent;
      });
      chart.render();
      // 设置默认选中
      var geom = chart.getGeoms()[0]; // 获取所有的图形
      var items = geom.getData(); // 获取图形对应的数据
      geom.setSelected(items[1]); // 设置选中
    },
    getCountClientInfo: () => {
      $.ajax({
        url: '/api/admin/customer_report',
        data: {
          'from_date': '',
          'to_date': ''
        },
        headers: {
          'X-Api-Key': csTools.token,
        },
        type: 'get',
        dataType: 'json',
        success: (result) => {
          console.log(result);
          if (result.data) {
            csTools.setNunjucksTmp({
              tmpSelector: '#temp',
              boxSelector: '.content-text',
              isAppend: 'append',
              data: result.data
            });
          }
        }
      })
    }
  };

  Main.init();
});
