/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import NavigationController from './NavigationController';


const {width, height} = Dimensions.get('window');


export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
          <NavigationController/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },

});
