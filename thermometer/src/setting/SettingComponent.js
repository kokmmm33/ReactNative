'use strict'

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
const grayColor = 'rgb(239,239,239)';

export default class SettingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {


    }

    componentWillUnmount() {

    }


    static navigationOptions = ({navigation}) => ({
        title: '设置',
        headerStyle: {
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
    });



    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={[{key: '历史记录'}, {key: '高低温设置'}, {key: '设备控制'},{key: '通用设置'},{key: '使用帮助'}]}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={this.renderSep}
                />
            </View>
        );
    }

    renderItem = ({item}) => (
        <TouchableOpacity
            onPress={()=>{this.itemClick(item)}}
        >
            <View style={styles.itemStyle}>
                <Text style={styles.itemTextStyle}>{item.key}</Text>
                <Image
                    source={require('../source/more.png')}
                    style={{width: 16, height: 16}}
                />
            </View>
        </TouchableOpacity>
    )

    renderSep = () => (
        <View style={{backgroundColor: grayColor, height:1}}/>
    )

    itemClick(item){
        if (item.key === '高低温设置') {
            console.log('高低温设置');
            this.props.navigation.navigate('SetLimit')
        }else if(item.key === '历史记录') {
            console.log('历史记录');
            this.props.navigation.navigate('History')
        }
    }



}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    itemStyle: {
        height: 58,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginRight: 10,
    },

    itemTextStyle: {
        fontSize: 17,
        marginLeft: 15,

    }
})