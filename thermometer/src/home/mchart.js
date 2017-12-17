
const chartColor = 'rgb(201,228,228)';
const lagerTextColor = 'rgb(62,106,116)';
const ccolor = 'rgb(123,170,175)';

var conf={
    /*去右下角水印*/
    credits: {
        enabled: false
    },

    chart: {
        marginTop: 40,
        /*表区背景颜色*/
        backgroundColor:  chartColor,
        /*绘图区背景颜色*/
        plotBackgroundColor: chartColor,


        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
    },


    // /*为图表配置标题*/
    title: {
        text: '  ',
    },
    //
    // /*为图表配置副标题*/
    // subtitle: {
    //   text: 'subtitle'
    // },


    /*配置要在 X 轴显示的项*/
    xAxis: {
        type: 'datetime',
        lineColor: lagerTextColor,
        lineWidth: 1,
        tickPixelInterval: 120,

        minRange: 2*60*1000,
        floor: ((new Date()).getTime()-2*60*1000),
        startOnTick: false,
        endOnTick: false,
        tickInterval: 30*1000, // 单位刻度间隔值

        minorTickPosition: 'inside', //刻度线在内部还是在外部
        labels:{
            style:{
                color:lagerTextColor,
            },
        },
    },

    /*配置要在 Y 轴显示的项*/
    yAxis: {
        title: {
            text: '温度',
            fontSize: 30,
            rotation: 0,
            align: 'high',
            margin: 0,
            offset: 3,
            y: -20,
            style:{
                color:ccolor,
            }
        },

        labels:{
            style:{
                color:lagerTextColor,
            }
        },

        gridLineWidth: 0,

    },

    /*配置提示信息*/
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        },

        crosshairs: [{            // 设置准星线样式
            width: 1,
            color: ccolor,
            dashStyle:'ShortDash',
        }]

    },

    /*配置图表对齐边框样式*/
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },

    /*配置图表要展示的数据*/
    series: [{
        name: '当前温度',
        color: lagerTextColor,
        data: (function () {
            //generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + (i+2) * 1000,
                    y: Math.random()*10+30
                });
            }
            // var time = (new Date()).getTime(),
            // y = Math.random()*10+30;
            return [];
        }())
    }]
};