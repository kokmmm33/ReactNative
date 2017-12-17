'use strict'

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import DBManager from '../tools/DBManager';

const grayColor = 'rgb(239,239,239)';
const cellHight = 58;
const {width, height} = Dimensions.get('window');

export default class HistoryComponent extends Component {

    constructor(props) {
      super(props);
      this.state = {
          series:[],
      };
      this.db = new DBManager();
    }

    static navigationOptions = ({navigation})=>(
        {
            title: '历史记录',
            headerStyle:{
                backgroundColor: grayColor,
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
        // 获取本地数据库数据
        this.db.getHistory((series)=>{
            for (let i=0;i<series.length;i++){
                series[i].key = i;
            }
            this.setState({
                series:series,
            });
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.series}
                    renderItem={this._renderItems}
                    //ItemSeparatorComponent={this._renderSeparator}
                />
            </View>
        );
    }

    _renderItems = ({item})=>{
        const {navigate} = this.props.navigation;
        return(
            <TouchableOpacity
                onPress={()=>{navigate('HistoryDetail',item)}}
            >
                <View style={styles.itemStyle}>
                    <View style={styles.timeViewStyle}>
                        <View style={[styles.timeLineStyle, {opacity:item.key == 0?0:1}]}/>
                        <View style={[styles.timeLineStyle, {opacity:item.key==(this.state.series.length-1)?0:1}]}/>
                        <Image style={[styles.imageSize,styles.timeLineImageStyle]} source={require('../source/时间轴.png')}/>
                    </View>

                    <View style={styles.itemContentStyle}>
                        <View style={styles.itemLeftStyle}>
                            <Text style={{fontSize:16, color: '#393a3a'}}>{item.dateStr}</Text>
                            <Text style={{fontSize:19}}>最高温度{item.max[1]}</Text>
                        </View>

                        <Image
                            source={require('../source/more.png')}
                            style={[styles.imageSize, {marginRight: 7}]}
                        />
                    </View>
                </View>
            </TouchableOpacity>

        );
    };

    _renderSeparator=()=>(
        <View style={{backgroundColor:grayColor, width: width, height:1}}/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: cellHight,
    },

    itemLeftStyle: {
        justifyContent: 'space-between',
    },

    imageSize: {
        width: 16,
        height: 16,
    },

    timeViewStyle:{
        marginLeft: 15,
        width: 30,
        height: cellHight,
        justifyContent: 'space-between'
    },

    itemContentStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:width - 45
    },

    timeLineStyle: {
        width: 2,
        height: cellHight*0.5-6,
        backgroundColor: grayColor,
        marginLeft: 7,
    },

    timeLineImageStyle: {
        position: 'absolute',
        top:cellHight*0.4,
        bottom:cellHight*0.5,
    }

})