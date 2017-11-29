import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import ChartView from 'react-native-highcharts';


var chartColor = '#dae1ea';

export default class ChartComponent extends Component {
    render() {
        var Highcharts='Highcharts';

        /*配置表格的json*/
        var conf={
            /*去右下角水印*/
            credits: {
                enabled: false
            },

            chart: {
                marginTop: 40,
                /*表区背景颜色*/
                backgroundColor: chartColor,
                /*绘图区背景颜色*/
                plotBackgroundColor: chartColor,


                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];

                        // setInterval(function () {
                        //     var x = (new Date()).getTime(), // current time
                        //         y = Math.random();
                        //     series.addPoint([x, y], true, true);
                        // }, 1000);
                    }
                },

                // style: {
                //
                //     //fontWeight: 'bold',
                //
                // }
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
                tickPixelInterval: 150,

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
                    y: -20
                },

                /*plotOptions用于设置图表中的数据点相关属性*/
                plotLines: [{
                    value: 0,
                    width: 0,
                    color: 'red',
                    hide: true
                }]
            },

            /*配置提示信息*/
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
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
                name: 'Random data',
                //color:'green',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            }]
        };

        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };



        return (
            <ChartView style={{height:300}} config={conf} options={options}></ChartView>
        );
    }
}