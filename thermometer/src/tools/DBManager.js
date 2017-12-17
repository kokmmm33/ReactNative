import {AsyncStorage} from 'react-native';

export default class DBManager{
    getHighLimit(callBack) {
        this.loadDataForKey('高', callBack);
    }

    getLowerLimit(callBack) {
        this.loadDataForKey('低', callBack);
    }

    saveData(date, callBack) {
        try {
            AsyncStorage.setItem(
                date.key,
                //date.value.toString(),
                JSON.stringify(date.value),
                (error)=>{
                    if (error){
                        alert('存值失败:',error);
                    }else{
                        callBack();
                    }
                }
            );
        } catch (error){
            alert('失败'+error);
        }
    }


    getHistory(callBack) {
        this.loadDataForKey('series',(result)=>{
            if (result){
                let series = JSON.parse(result);
                console.log('取出数据series:'+series+'type:'+typeof(series));
                callBack(series);
            }else {
                console.log('没有取到指定数据');
            }
        });
    }

    loadDataForKey(key, callBack) {
        try {
            AsyncStorage.getItem(
                key,
                (error,result)=>{
                    if (error){
                        alert('取值失败:'+error);
                    }else{
                        callBack(result);
                    }
                }
            )
        }catch (error){
            alert('失败'+error);
        }
    }
}