/**
 * Created by lijiabin on 2018/5/2.
 */
import React, { Component } from 'react';
// import detail from './app/component/detail'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView,
    Dimensions,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'

const { width,height } = Dimensions.get('window');

type Props = {};
export default class IndexComponent extends Component<Props> {
    dowithMessage(data){
        this.props.navigation.navigate('Main',{data:data});
    }
    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={{uri:`file:///android_asset/www/index.html`}}
                    style={{width,flex:1}}

                    onMessage={(event)=>this.dowithMessage(event.nativeEvent.data)}
                >

                </WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
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