'use strict'

import React, { Component } from 'react';
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    AsyncStorage,
    WebView,
    Image,
    AppState,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import BleCenter from '../tools/BleCenter';
import {LowerThemeColors,HighThemeColors, NomalThemeColors} from '../globle/GlobleDefine';
import Sound from 'react-native-sound';
import DBManager from '../tools/DBManager';

const {width, height} = Dimensions.get('window');
export default class HomeComponent extends Component {
    constructor(props) {
      super(props);

      // 当前温度状态
      this.status = {
          normal: 0,
          high: 1,
          lower: 2,
      };

      this.state = {
          selected: 0,
          limitHight: 0,
          limitLower: 0,
          currentValue: 35.00,
          currentStatus: this.status.normal,
          todaySeries:[],
          series:[],
          displayValue: '--.--',
          tabTitle:['2m','30m','1h','6h','12h'],
          tabValue:[2,30,60,360,720],
          themeColor: NomalThemeColors,
      };

      this.db = new DBManager();
    }

    componentDidMount() {

        //每次启动程序时加载高低温报警设置
        setTimeout(()=>{
            this.loadLimitData();
        },2000);

        // 实时监听高低温设置
       this.hightListener =  DeviceEventEmitter.addListener('addLimit',()=>{
           this.loadLimitData();
       });

       // 获取本地数据库数据
        this.db.getHistory((series)=>{
            this.setState({
                series: series,
            });
        });

        // 初始化并尝试连接蓝牙
        //this.bleCenter.startBLE();

        // 测试 每2秒随机生成数据
        setInterval(()=>{
            var y = Math.random()*10+30;
            y = parseFloat(y.toFixed(2));

            if (this.webview) {
                if (y === undefined) {
                    y = 30;
                }
                this.setState({
                    currentValue:y
                });
            }
        },2000)

        // 每两秒更新显示一次数据
        setInterval(()=>{
            // 存储每次更新的数据点
            let curTime = (new Date()).getTime();
            this.state.todaySeries.push([curTime, this.state.currentValue]);


            let posData = {'type':'upData','value':this.state.currentValue}
            this.webview.postMessage(JSON.stringify(posData));
            this.setState({
                displayValue:this.state.currentValue
            })

            if (this.state.limitHight < this.state.currentValue){
                if (this.state.currentStatus === this.status.high) {
                    return;
                }
                this.setState({
                    currentStatus:this.status.high
                });
                //this.playSound('当前温度已超过设置温度');
                this.setState({
                    themeColor: HighThemeColors
                });
                this.setupChartTheme();
            }else if (this.state.limitLower > this.state.currentValue) {
                if (this.state.currentStatus === this.status.lower) {
                    return;
                }
                this.setState({
                    currentStatus:this.status.lower
                });
                //this.playSound('当前温度低于设置温度');
                this.setState({
                    themeColor: LowerThemeColors
                });
                this.setupChartTheme();
            }else {
                if (this.state.currentStatus === this.status.normal) {
                    return;
                }
                this.setState({
                    currentStatus:this.status.normal
                });
                this.setState({
                    themeColor: NomalThemeColors
                });
                this.setupChartTheme();
            }
        },2000);

        // 进入后台存储数据

        AppState.addEventListener('change',(change)=>{
            console.log('当前App状态：'+change);
            if (change === 'background') {
                console.log('进入后台');
                let seriePoint = this.state.todaySeries;
                let max = seriePoint.reduce(function (a,b) {
                    if (a[1]>b[1]) {
                        return a;
                    }else {
                        return b;
                    }
                })

                let dateTime = (new Date()).toLocaleDateString();
                let dataJson = {
                    dateStr: dateTime,
                    max: max,
                    limitH: this.state.limitHight,
                    limitL: this.state.limitLower,
                    data: seriePoint
                };
                console.log('this.state.series:'+this.state.series+'type:'+typeof(this.state.series));
                console.log(dataJson);
                this.state.series.push(dataJson);

                let data = {key: 'series', value: this.state.series};
                this.db.saveData(data,()=>{
                    console.log('存储成功');
                })
            }
        });

    }

    static navigationOptions = {
        header: null

    }

    render(){
        const { navigate } = this.props.navigation;
        const curTheme = this.state.themeColor;
        var icon = require('../source/settingNormal.png');
        if (this.state.currentStatus === this.status.high) {
            icon = require('../source/settingHigh.png');
        }else if (this.state.currentStatus === this.status.lower) {
            icon = require('../source/settingLower.png');
        }else {
            icon = require('../source/settingNormal.png');
        }

        var HTMLsource;

        if (Platform.OS === 'android') {
            HTMLsource  = { uri:'file:///android_asset/mchart.html' }
        }else{
            HTMLsource = require('./mchart.html');
        }


        return(
            <View style={styles.container}>

                <View style={[styles.headerStyle,{backgroundColor: curTheme.coolColor}]}>

                    <Text style={[styles.headerTitleStyle, {color:curTheme.lagerTextColor}]}>当前温度</Text>

                   <TouchableOpacity
                       style={styles.settingIconStyle}
                       onPress={()=>{navigate('Details')}}
                   >
                    <Image
                        style={{width: 24, height: 24}}
                        source={icon}
                    >

                    </Image>
                    </TouchableOpacity>

                </View>

                {/*头部视图*/}
                <View style={[styles.topStyle, {backgroundColor: curTheme.coolColor}]}>
                    <View style={styles.TopTextContainerStyle}>
                        <Text style={[styles.topTextStyle,{color: curTheme.lagerTextColor}]}>{this.state.displayValue}</Text>
                        <Text style={[{fontSize:20}, {color:curTheme.ccolor}]}>℃</Text>
                    </View>
                </View>

                {/*表视图*/}
                <View style={[styles.chartBgStyle,{backgroundColor: curTheme.chartColor}]}>
                    <WebView
                        onMessage={this.handleMessage}
                        ref={webview => { this.webview = webview; }}
                        automaticallyAdjustContentInsets={true}
                        mixedContentMode={'always'}

                        source={HTMLsource}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        onNavigationStateChange={this.onNavigationStateChange}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        scrollEnabled={false}
                    />
                </View>


                {/*底部选项视图*/}
                <View style={[styles.bottomStyle, {backgroundColor: curTheme.chartColor}]}>
                    <View style={styles.segmentedControlStyle}>
                        <SegmentedControlTab
                            tabStyle={{backgroundColor: curTheme.chartColor, borderColor: curTheme.lagerTextColor}}
                            tabTextStyle={{color: curTheme.lagerTextColor}}
                            activeTabStyle={{backgroundColor: curTheme.lagerTextColor}}
                            selectedIndex={this.state.selected}
                            onTabPress= {this.bottomTabClick}
                            values={this.state.tabTitle}
                        />
                    </View>
                </View>
            </View>
        );
    }

    bottomTabClick = (index)=>{
        this.setState({selected:index});
        console.log(index);
        let value = this.state.tabValue[index];
        if (this.webview) {
            console.log('设置范围');
            console.log(value);
            let posData = {'type':'设置x数值范围','value':value};
            this.webview.postMessage(JSON.stringify(posData));
        }
    };

    handleMessage = (evt: any) => {
        const message = evt.nativeEvent.data
        console.log('web输出：');
        console.log(message);
    }


    bleCenter = new BleCenter((values)=>{

            if (this.webview) {
                var y = values[0];
                if (y === undefined) {
                    y = 30;
                }
                this.setState({
                    currentValue:y
                });
            }
    });

    setupChartTheme(){
        let posData = {'type':'主题切换','value':this.state.themeColor};
        this.webview.postMessage(JSON.stringify(posData));
    }


    loadLimitData(){
        try {
            AsyncStorage.getItem(
                '高',
                (error,result)=>{
                    if (error){
                        alert('取值失败:'+error);
                    }else{
                        this.setState({
                            limitHight:result
                        });
                        let posData = {'type':'高温报警值','value':result}
                        if (this.webview){
                            this.webview.postMessage(JSON.stringify(posData));
                            console.log('高温报警值加载数据完成');
                        }else {
                            console.log('高温报警值未加载');
                        }

                    }
                }
            )

            AsyncStorage.getItem(
                '低',
                (error,result)=>{
                    if (error){
                        alert('取值失败:'+error);
                    }else{
                        this.setState({
                            limitLower:result
                        });
                        let posData = {'type':'低温报警值','value':result}
                        if (this.webview){
                            this.webview.postMessage(JSON.stringify(posData));
                            console.log('低温报警值加载数据完成');
                        }else {
                            console.log('低温报警值未加载');
                        }

                    }
                }
            )
        }catch(error){
            alert('失败'+error);
        }
    }

    playSound(meg){
        Sound.setCategory('Playback');
        this.stopSound;
        this.whoosh = new Sound('3462.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }



            this.whoosh.setVolume(0.5);
            this.whoosh.play((success) => {
                if (success) {
                    console.log('成功播放');

                } else {
                    console.log('播放失败');

                }
            });
        });

        Alert.alert(
            '报警',
            meg,
            [
                {text: '知道了', onPress:this.stopSound},
            ],
            { cancelable: false }
        )
    }

    stopSound = ()=>{
        console.log('停止播放');
        this.whoosh.stop();
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
    },

    headerStyle: {
        flexDirection: 'row',
        width:width,
        height:64,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitleStyle: {
        fontSize: 17,
        fontWeight:'500',
        marginTop:10,
    },

    settingIconStyle: {
        width: 35,
        height: 35,
        position: 'absolute',
        top: 25,
        right: 5,
    },

    detailsScreenStyle: {
        flex: 1,
        backgroundColor:'white',
        marginTop:Platform.OS == 'ios'?20:0,
    },

    TopTextContainerStyle: {
        flexDirection: 'row',
    },

    topStyle: {
        height: height*0.3,
        alignItems: 'center',
        justifyContent: 'center',
        /*导航栏高度*/
    },

    topTextStyle: {
        fontSize: 56,
    },

    chartBgStyle: {
        height: height*0.45,
        width: width,
    },

    bottomStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Platform.OS === 'iOS' ? height*0.25:height*0.1,
    },

    segmentedControlStyle: {
        justifyContent: 'center',
        width:width*0.8,
        height: 50,

    },

})
