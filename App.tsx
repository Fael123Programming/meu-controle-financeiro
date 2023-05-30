import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { App } from './src/';
import {
  View,
  Text
} from 'react-native';

const MainApp = () => {
  return <Provider store={store}>
    <App/>
  </Provider>
}

export default MainApp;
// Login: rafaelfonseca1020@gmail.com
// Password: abcdE@