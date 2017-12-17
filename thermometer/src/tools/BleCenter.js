import React, { Component } from 'react'
import {
    Platform,
    Alert,
} from 'react-native'
import BleModule from './BleModule';

//确保全局只有一个BleManager实例，BleModule类保存着蓝牙的连接信息
global.BluetoothManager = new BleModule();

export default class BleCenter{
    constructor(updateCallBack) {
        this.scaning = false;
        this.isConnected = false;
        this.writeData = '';
        this.receiveData = '';
        this.readData = '';
        this.isMonitoring = false;
        this.text = ' ';
        this.valueUpdate = updateCallBack;

        this.bluetoothReceiveData = [];  //蓝牙接收的数据缓存
        this.deviceMap = new Map();
        this.targetName = 'XXXX C2-B';
        this.targetSerID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
        this.targetCharcID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
        this.targetP = null;

    }

    startBLE(){
        BluetoothManager.start();  //蓝牙初始化
        this.updateStateListener = BluetoothManager.addListener('BleManagerDidUpdateState',this.handleUpdateState);
        this.stopScanListener = BluetoothManager.addListener('BleManagerStopScan',this.handleStopScan);
        this.discoverPeripheralListener = BluetoothManager.addListener('BleManagerDiscoverPeripheral',this.handleDiscoverPeripheral);
        this.connectPeripheralListener = BluetoothManager.addListener('BleManagerConnectPeripheral',this.handleConnectPeripheral);
        this.disconnectPeripheralListener = BluetoothManager.addListener('BleManagerDisconnectPeripheral',this.handleDisconnectPeripheral);
        this.updateValueListener = BluetoothManager.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValue);
    }

    stopBLE(){
        this.updateStateListener.remove();
        this.stopScanListener.remove();
        this.discoverPeripheralListener.remove();
        this.connectPeripheralListener.remove();
        this.disconnectPeripheralListener.remove();
        this.updateValueListener.remove();
        if(this.isConnected){
            BluetoothManager.disconnect();  //退出时断开蓝牙连接
        }
        this.timer && clearTimeout(this.timer);
    }

    //蓝牙状态改变
    handleUpdateState=(args)=>{
        console.log('BleManagerDidUpdateStatea:', args);
        BluetoothManager.bluetoothState = args.state;
        if(args.state == 'on'){  //蓝牙打开时自动搜索
            this.scan();
        }
    }

    //扫描结束监听
    handleStopScan=()=>{
        console.log('BleManagerStopScan:','Scanning is stopped');
        this.scaning = false;
    }

    //搜索到一个新设备监听
    handleDiscoverPeripheral=(data)=>{
        // console.log('BleManagerDiscoverPeripheral:', data);
        console.log(data.id,data.name);
        let id;  //蓝牙连接id
        let macAddress;  //蓝牙Mac地址
        if(Platform.OS == 'android'){
            macAddress = data.id;
            id = macAddress;
        }else{
            //ios连接时不需要用到Mac地址，但跨平台识别是否是同一设备时需要Mac地址
            //如果广播携带有Mac地址，ios可通过广播0x18获取蓝牙Mac地址，
            macAddress = BluetoothManager.getMacAddressFromIOS(data);
            id = data.id;
        }
        this.deviceMap.set(data.id,data);  //使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备
        this.connectTarget(data);
    }

    connectTarget(item){
        if (item.name === this.targetName) {
            console.log('正在连接-----');
            this.connect(item);
        }
    }

    //蓝牙设备已连接
    handleConnectPeripheral=(args)=>{

        console.log('BleManagerConnectPeripheral:', args);
        this.targetP = args;
        console.log('连接成功,可监听：',BluetoothManager.nofityCharacteristicUUID[0]);

        this.timer = setTimeout(
            () => {
                BluetoothManager.nofityCharacteristicUUID.map(
                    (item, index)=>{
                        console.log('可监听===','item:',item,'index:',index);
                        if (item === this.targetCharcID){
                            this.notify(index);
                        }
                    }
                );
            },
            2000
        );




    }

    //蓝牙设备已断开连接
    handleDisconnectPeripheral=(args)=>{
        console.log('BleManagerDisconnectPeripheral:', args);
        BluetoothManager.initUUID();  //断开连接后清空UUID

        this.isConnected = false;
        this.writeData = '';
        this.receiveData = '';
        this.readData = '';
    }

    //接收到新数据
    handleUpdateValue=(data)=>{
        //ios接收到的是小写的16进制，android接收的是大写的16进制，统一转化为大写16进制
        let value = data.value;
        this.valueUpdate(value);
        this.bluetoothReceiveData.push(value);
        this.receiveData = this.bluetoothReceiveData.join(' ');
    }

    connect(item){
        //当前蓝牙正在连接时不能打开另一个连接进程
        if(BluetoothManager.isConnecting){
            console.log('当前蓝牙正在连接时不能打开另一个连接进程');
            return;
        }
        if(this.scaning){  //当前正在扫描中，连接时关闭扫描
            BluetoothManager.stopScan();
            this.scaning = false;
        }

        BluetoothManager.connect(item.id)
            .then(peripheralInfo=>{
                //连接成功，列表只显示已连接的设备
                this.alert('连接成功');
                this.isConnected = true;
            })
            .catch(err=>{
                this.alert('连接失败');
            })
    }

    disconnect(){
        this.isConnected = false;
        BluetoothManager.disconnect();
    }

    scan(){
        if(this.scaning){  //当前正在扫描中
            BluetoothManager.stopScan();
            this.scaning = false;
        }
        if(BluetoothManager.bluetoothState == 'on'){
            BluetoothManager.scan()
                .then(()=>{
                    this.scaning = true;
                }).catch(err=>{

            })
        }else{
            BluetoothManager.checkState();
            if(Platform.OS == 'ios'){
                this.alert('请开启手机蓝牙');
            }else{
                Alert.alert('提示','请开启手机蓝牙',[
                    {
                        text:'取消',
                        onPress:()=>{ }
                    },
                    {
                        text:'打开',
                        onPress:()=>{ BluetoothManager.enableBluetooth() }
                    }
                ]);
            }

        }
    }


    alert(text){
        Alert.alert('提示',text,[{ text:'确定',onPress:()=>{ } }]);
    }

    write=(index)=>{
        if(this.text.length == 0){
            this.alert('请输入消息');
            return;
        }
        BluetoothManager.write(this.text,index)
            .then(()=>{
                this.bluetoothReceiveData = [];
                this.writeData = 'doohan';
            })
            .catch(err=>{
                this.alert('发送失败');
            })
    }

    writeWithoutResponse=(index)=>{
        if(this.text.length == 0){
            this.alert('请输入消息');
            return;
        }
        BluetoothManager.writeWithoutResponse(this.text,index)
            .then(()=>{
                this.bluetoothReceiveData = [];
                this.writeData = 'doohan';
            })
            .catch(err=>{
                this.alert('发送失败');
            })
    }

    read=(index)=>{
        BluetoothManager.read(index)
            .then(data=>{
                this.readData = data;
            })
            .catch(err=>{
                this.alert('读取失败');
            })
    }

    notify=(index)=>{
        BluetoothManager.startNotification(index)
            .then(()=>{
                this.isMonitoring = true;
                this.alert('开启成功');
            })
            .catch(err=>{
                this.isMonitoring = false;
                this.alert('开启失败');
            })
    }

}
