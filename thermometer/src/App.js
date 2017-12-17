/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { StackNavigator } from 'react-navigation';
import HomeComponent from './home/HomeComponent';
import SettingComponent from './setting/SettingComponent';
import SetLimitComponent from './setting/SetLimitComponent';
import LimitDetailComponent from './setting/LimitDetailComponent';
import HistoryComponent from './history/HistoryComponent';
import HistoryDetailComponent from './history/HistoryDetailComponent';

const RootNavigator = StackNavigator({
    Home: {
        screen: HomeComponent,
    },
    Details: {
        screen: SettingComponent,
    },

    SetLimit: {
        screen: SetLimitComponent,
    },

    LimitDetail: {
        screen: LimitDetailComponent,
    },

    History: {
        screen: HistoryComponent,
    },

    HistoryDetail: {
        screen: HistoryDetailComponent,
    },

});

export default RootNavigator;



