import React from 'react';
import { View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import AppMain from './AppMain';
import Camera from './src/components/Camera';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import reducers from './src/reducers/index';

const AppRN = createAppContainer(createStackNavigator(
    {
        AppMain: {
            screen: AppMain
        },
        Camera: {
            screen: Camera
        }
    },
    {
        initialRouteName: 'AppMain'
    }
))

export default class App extends React.Component {

    render() {
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
                <View style={{ flex: 1 }}>
                    <AppRN />
                </View>
            </Provider>
        );
    }
}