'use strict'

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import DBManager from '../tools/DBManager';

const grayColor = 'rgb(239,239,239)';

export default class SetLimitComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highLimit: '',
            lowerLimit: '',
        };
    }

    componentDidMount() {
        let DB = new DBManager();
        DB.getHighLimit((value)=>{
            console.log('===高==');
            console.log(value);
            this.setState({
                highLimit: value,
            });
        })

        DB.getLowerLimit((value)=>{
            console.log('===低==');
            console.log(value);
            this.setState({
                lowerLimit: value,
            });
        })

    }

    componentWillUnmount() {

    }

    static navigationOptions = ({navigation})=>(
        {
            title: '高低温设置',
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

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={[{key: '低温设置', value: this.state.lowerLimit}, {key: '高温设置', value: this.state.highLimit}]}
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
                <View style={styles.rightStyle}>
                    <Text style={styles.itemTextStyle}>{item.value}</Text>
                    <Image
                        source={require('../source/more.png')}
                        style={{width: 16, height: 16}}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )

    renderSep = () => (
        <View style={{backgroundColor: grayColor, height:1}}/>
    )

    itemClick(item){
        this.props.navigation.navigate('LimitDetail',{screenTitle:item.key});
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

    rightStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        width: 70,
        height: 58,
    },

    itemTextStyle: {
        fontSize: 17,
        marginLeft: 15,

    }
})