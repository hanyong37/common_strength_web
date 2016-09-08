var option = {
    title: {
        text: '动态数据'
    },
    legend: {s
        data:['最高气温','最低气温']
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['0','10','20','30','40','50']
    },
    series: [
        {

            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10]
        },
        {
            type:'line',
            data:[1, 0, 2, 5, 3, 2, 0]
        }
    ]
};
