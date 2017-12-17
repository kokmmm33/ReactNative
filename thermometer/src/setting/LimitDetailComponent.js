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

const {width, height} = Dimensions.get('window');


export default class LimitDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            largerValue: '35',
            decimalValue: '5',
        };
        this.titleKey = this.props.navigation.state.params.screenTitle[0];
       
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
                    {/*整数*/}
                    <Picker
                        style={styles.pickerStyle1}
                        itemStyle={styles.itemStyle}
                        selectedValue={this.state.largerValue}
                        onValueChange={(lang) => this.setState({largerValue:lang})}>
                        {this.getItems1.map((value)=> <Picker.Item label={value.key} value={value.key} key={value.key}/> )}
                    </Picker>


                    <Picker
                        style={styles.pickerStyle1}
                        itemStyle={{color:LowerThemeColors.ccolor, fontSize:30}}>
                        <Picker.Item label='&bull;' />
                    </Picker>

                    {/*小数*/}
                    <Picker
                        style={styles.pickerStyle2}
                        itemStyle={styles.itemStyle}
                        selectedValue={this.state.decimalValue}
                        onValueChange={(lang) => this.setState({decimalValue:lang})}>
                        {this.getItems2.map((value)=> <Picker.Item label={value.key} value={value.key} key={value.key}/> )}
                    </Picker>

                    <Picker
                        style={styles.pickerStyle1}
                        itemStyle={{color:LowerThemeColors.ccolor, fontSize:30}}>
                        <Picker.Item label='℃' />
                    </Picker>

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
    getItems1 = [{key:'30'},{key:'31'},{key:'32'},{key:'33'},{key:'34'},{key:'35'},{key:'36'},{key:'37'},{key:'38'},{key:'39'},{key:'40'}];
    getItems2 = [{key:'0'},{key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},{key:'6'},{key:'7'},{key:'8'},{key:'9'}];

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
