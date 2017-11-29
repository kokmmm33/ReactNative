import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ChartComponent from './ChartComponent';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';


var coolColor = '#c9d2e1';
var chartColor = '#dae1ea';

const {width,height} = Dimensions.get('window');
const DetailsScreen = () => (
    <View style={styles.container}>
        <Text>Home Screen</Text>

        <View style={styles.topStyle}>

        </View>


    </View>
);

const HomeScreen = ({ navigation }) => (
    <View style={styles.container}>
        <Text>Home Screen</Text>

        {/*头部视图*/}
        <View style={styles.topStyle}>
            <View style={styles.TopTextContainerStyle}>
                <Text style={styles.topTextStyle}>31.05</Text>
                <Text style={[styles.topTextStyle,{fontSize:20}]}>℃</Text>
            </View>
        </View>

        {/*表视图*/}
        <View style={styles.chartBgStyle}>
            <ChartComponent/>
        </View>


        {/*底部选项视图*/}
        <View style={styles.bottomStyle}>
            <View style={styles.segmentedContainer}>
                <SegmentedControlTab
                    values={['First', 'Second', 'Third']}
                    // selectedIndex={this.state.selectedIndex}
                    // onTabPress={this.handleIndexChange}
                />
            </View>
        </View>



    </View>
);

const NavigationController = StackNavigator(
    /*导航控制器所有页面的路由信息*/
    {

        Home: {
            screen: HomeScreen,
            navigationOptions: {
                headerTitle: '当前温度',
                headerStyle: {
                    backgroundColor: coolColor,
                    shadowColor: coolColor,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                headerRight: (<Button
                    onPress={() => navigation.Details}
                    title="设置"
                />),

            },
        },
        Details: {
            screen: DetailsScreen,
            navigationOptions: {
                headerTitle: '设置',


            },

        },
    },
    /*配置信息*/
    {
        //headerMode: 'none',
        cardStack: {
            gesturesEnabled: true,
        },
    }
);

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: coolColor,

    },

    detailsScreenStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: coolColor,
    },

    TopTextContainerStyle: {
        flexDirection: 'row',
    },

    topStyle: {
        height: height*0.3,
        backgroundColor: coolColor,
        alignItems: 'center',
        justifyContent: 'center',
        /*导航栏高度*/
        marginTop:44,

    },

    topTextStyle: {
        fontSize: 50,
        color: 'rgb(63,94,140)',
    },

    chartBgStyle: {
        height: height*0.5,
        backgroundColor: coolColor,
    },

    bottomStyle: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor:chartColor,
        height: height*0.5,
    },

    segmentedContainer: {
        // width: width*0.8,
        // height: 200,

    },
});


export default NavigationController;

