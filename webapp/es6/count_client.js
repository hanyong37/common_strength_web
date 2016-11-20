$(function(){
  const Main = {
    init: ()=> {
      $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD'
      });

      $('.select-store').selectpicker({
        size: 5,
        liveSearch: true
      }).on('changed.bs.select', function(e){
        console.log('change');
        $(".btn-info").trigger('click');
      });

      Main.BindChangeStore(() => {
        Main.getCountClientInfo({
          'startTime': '',
          'endTime': ''
        });
      });



      $(".btn-info").on('click', function() {
        const start_datetime = $("#start_datetime").val();
        const over_datetime = $("#over_datetime").val();

        Main.getCountClientInfo({
          'startTime': start_datetime,
          'endTime': over_datetime
        });
      });

    },
    BindChangeEvent: ()=>{
      $("a.kcph").on('click', function(){
        const _self = $(this);
        $("a.kcph").siblings('.chart-tmp').remove();
        const data = _self.attr('data');
        let dataItems = [];
        console.log();
        const type = _self.attr('type');
        let typeName = null;
        if (type == 0) {
          typeName = '课程偏好统计';
        } else {
          typeName = '时段偏好统计';
        }

        var html = '<div class="chart-tmp"><span class="glyphicon glyphicon-remove j-remove"></span>'
                +'<h4 class="tmp-left">' + typeName + '</h4>'
                + '<div>' + data + '</div>'
                +'</div>';
        _self.parent('li').append(html);
        // Main.BindChartEvent(data);

        $('.j-remove').off('click').on('click', function() {
          $(this).parent().remove();
        });
      });

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
    getCountClientInfo: (a) => {
      const storeId = $('.select-store').selectpicker('val');
      $.ajax({
        url: '/api/admin/customer_report',
        data: {
          'from_date': a.startTime,
          'to_date': a.endTime,
          'store_id': storeId
        },
        headers: {
          'X-Api-Key': csTools.token,
        },
        type: 'get',
        dataType: 'json',
        success: (result) => {
          console.log(result);
          if (result.data) {
            $('.content-table.list').remove();
            csTools.setNunjucksTmp({
              tmpSelector: '#temp',
              boxSelector: '.content-text',
              isAppend: 'append',
              data: result.data,
              callback: () => {
                Main.BindChangeEvent();
              }
            });
          }
        }
      });
    },
    BindChangeStore: (fun) => {
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

          $('.select-store option').remove();
          csTools.setNunjucksTmp({
            tmpSelector: '#temp_Select',
            boxSelector: 'select.select-store',
            data: data,
            isAppend: true,
            callback: () => {
              $('.select-store').selectpicker('refresh');
              fun();
            }
          });
        },
        error: (xhr, textStatus, errorThrown) => {
          if(xhr.status == 403){
            location.href = 'login';
          }
        }
      });
    }
  };

  Main.init();
});
