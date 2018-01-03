'use strict'

import React, { Component } from 'react';
import {
    Platform,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Picker,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import {LowerThemeColors} from '../globle/GlobleDefine';
import {Wheel} from 'teaset';

const {width, height} = Dimensions.get('window');


export default class LimitDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            largerValue: 30,
            decimalValue: 0,
        };
        this.titleKey = this.props.navigation.state.params.screenTitle[0];
        this.item1 = [];
        this.item2 = [];
        for(let i = 0; i < 10; i++) {
            this.item1.push((i+30));
            this.item2.push(i);
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: `${navigation.state.params.screenTitle[0]}温报警设置`,
        headerLeft:()=>(
            <TouchableOpacity
                onPress={()=>{navigation.goBack()}}
            >
                <Image
                    source={require('../source/back.png')}
                    style={{width:20, height:20, marginLeft:8}}
                />
            </TouchableOpacity>),

    });

    render() {
        const {optionGroups, valueGroups} = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.topViewStyle}>
                    <Wheel
                    style={{height: 200, width: 50}}
                    itemStyle={{textAlign: 'center', fontSize: 20}}
                    items={this.item1}
                    //index={35}
                    holeStyle={{height: 50}}
                    onChange={index => this.setState({largerValue: this.item1[index]})}
                    />
                    <Wheel
                    style={{height: 200, width: 50}}
                    itemStyle={{textAlign: 'center', fontSize: 20}}
                    items={this.item2}
                    //index={5}
                    holeStyle={{height: 50}}
                    onChange={index => this.setState({decimalValue: this.item2[index]})}
                    />

                    <Text style={{fontSize: 15, position: 'absolute', top: 120, left: 70}}
                    >&bull;</Text>

                    <Text style={{fontSize: 15, position: 'absolute', top: 100, right: 10}}>℃</Text>
                    
                </View>

                <View style={styles.bottomStyle}>
                    <Text style={styles.tipStyle}>宝宝体温{this.titleKey}于此温度时将会提醒您</Text>

                    <TouchableOpacity
                        onPress={this.popScreen}
                    >
                        <View style={styles.buttonStyle}>
                            <Text>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // getItems1 = [{key:'30'},{key:'31'},{key:'32'},{key:'33'},{key:'34'},{key:'35'},{key:'36'},{key:'37'},{key:'38'},{key:'39'},{key:'40'}];
    // getItems2 = [{key:'0'},{key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},{key:'6'},{key:'7'},{key:'8'},{key:'9'}];

    popScreen = ()=>{
        var {largerValue, decimalValue} = this.state;
        var settingValue = parseInt(largerValue) + parseInt(decimalValue) * 0.1;
        try {
            AsyncStorage.setItem(
                this.titleKey,
                settingValue.toString(),
                (error)=>{
                    if (error){
                        alert('存值失败:',error);
                    }else{
                        DeviceEventEmitter.emit('addLimit');
                        this.props.navigation.goBack();
                    }
                }
            );
        } catch (error){
            alert('失败'+error);
        }
    }

};
    
    


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent: 'space-between',
    },

    topViewStyle:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        padding: 20,
        marginTop: 70,


    },

    pickerStyle1:{
        width:50,
        height:200,
        marginTop:150,

    },

    pickerStyle2:{
        width:50,
        height:200,
        marginTop:150,
    },

    itemStyle: {
        color: LowerThemeColors.lagerTextColor,
        fontSize: 30,
    },

    tipStyle:{
        fontSize:10,
        marginBottom:20,
    },

    buttonStyle:{
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#7f8388',
        width: width*0.8,
        height: 45,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 0,
    },

    bottomStyle:{
        marginBottom: 30,
        alignItems:'center',
    }


})
