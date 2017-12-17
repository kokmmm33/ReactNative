'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    WebView,
} from 'react-native';
import {GlobleColor} from '../globle/GlobleDefine';

export default class HistoryDetailComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.data = this.props.navigation.state.params;
    }

    static navigationOptions = ({navigation})=>(
        {
            title: '体温详情',
            headerStyle:{
                backgroundColor: GlobleColor.navigationBarBG,
            },
            headerLeft:()=>(
                <TouchableOpacity
                    onPress={()=>{navigation.goBack()}}
                >
                    <Image
                        source={require('../source/back.png')}
                        style={{width:20, height:20, marginLeft:8}}
                    />
                </TouchableOpacity>),
        }
    )

    componentDidMount() {
        console.log('向web发送数据:');

         setTimeout(()=>{
             if (this.webview) {
                 console.log(this.data);
                 this.webview.postMessage(JSON.stringify(this.data));
             }
         },500);
    }

    render(){
        const data = this.data;

        return(
            <View style={styles.container}>
                {/*最高温*/}
                <View style={styles.lineItemStyle}>
                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Image style={styles.iconStyle} source={require('../source/高温.png')}/>
                        <Text style={{marginLeft:8, fontSize:19}}>最高温度</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.lineItemRightTextStyle}>34.90</Text>
                        <View style={{width:2, backgroundColor:GlobleColor.textColor, marginRight:5, marginLeft:5}}/>
                        <Text style={styles.lineItemRightTextStyle}>10:32</Text>
                    </View>
                </View>
                <View style={styles.separatorStyle}/>

                {/*温度曲线*/}
                <View style={[styles.lineItemStyle, {justifyContent: 'flex-start'}]}>
                        <Image style={styles.iconStyle} source={require('../source/曲线.png')}/>
                        <Text style={{marginLeft:8, fontSize:19}}>温度曲线</Text>
                </View>
                <View style={styles.separatorStyle}/>

                {/*曲线图*/}
                <View style={{height: 300, margin:15}}>
                    <WebView
                        ref={webview => { this.webview = webview}}
                        automaticallyAdjustContentInsets={true}
                        source={require('./HistoryChart.html')}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        scrollEnabled={false}
                        onMessage={this.handleMessage}
                    />
                </View>
            </View>

        );
    }

    handleMessage = (evt: any) => {
        const value = evt.nativeEvent.data;
        console.log('web输出：');
        console.log(value);
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },

    iconStyle:{
        width: 24,
        height: 24,
    },

    lineItemStyle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        height: 58,
    },

    lineItemRightTextStyle: {
        fontSize:17,
        color: GlobleColor.textColor,

    },

    separatorStyle: {
        height:1,
        backgroundColor:GlobleColor.subTextColor,
        marginLeft:15, marginRight:15
    },
});