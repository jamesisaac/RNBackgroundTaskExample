// @flow

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import BackgroundTask from 'react-native-background-task'

function currentTimestamp(): string {
  const d = new Date()
  const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
  return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
}

BackgroundTask.define(
  async () => {
    console.log('Hello from a background task')

    const value = await AsyncStorage.getItem('@MySuperStore:times')
    await AsyncStorage.setItem('@MySuperStore:times', `${value || ''}\n${currentTimestamp()}`)

    // Or, instead of just setting a timestamp, do an http request
    /* const response = await fetch('http://worldclockapi.com/api/json/utc/now')
    const text = await response.text()
    await AsyncStorage.setItem('@MySuperStore:times', text) */

    BackgroundTask.finish()
  },
)

export default class AsyncStorageTimestamp extends Component {
  constructor() {
    super()
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    BackgroundTask.schedule()
    this.checkStatus()
  }

  async checkStatus() {
    const status = await BackgroundTask.statusAsync()
    console.log(status.available)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>
          react-native-background-task!
        </Text>
        <Text style={styles.instructions}>
          The defined task (storing the current timestamp in AsyncStorage)
          should run while the app is in the background every 15 minutes.
        </Text>
        <Text style={styles.instructions}>
          Press the button below to see the current value in storage.
        </Text>
        <Button
          onPress={async () => {
            const value = await AsyncStorage.getItem('@MySuperStore:times')
            console.log('value', value)
            this.setState({ text: value })
          }}
          title="Get"
        />
        <Text>{this.state.text}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 15,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AsyncStorageTimestamp', () => AsyncStorageTimestamp);
