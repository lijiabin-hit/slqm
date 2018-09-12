/**
 * Created by lijiabin on 2018/5/6.
 */
import React, { Component } from 'react';
// import detail from './app/component/detail'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"
const { width,height } = Dimensions.get('window');

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class TestComponent extends Component<Props> {
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="测&nbsp;&nbsp;&nbsp;试"/>),
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <TouchableOpacity
                    onPress={()=>navigation.navigate('Users')}><LogoRight/></TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack()}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
        }
    }
    dowithMessage(type,data){
        this.props.navigation.navigate('DetailTest',{type:type,data:data});
    }
    render() {
        const { params } = this.props.navigation.state;
        const data = params ? params.data : null;
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={{uri:'file:///android_asset/www/test1.html'}}
                    style={{width,marginTop:-40,}}
                    onMessage={(event)=>this.dowithMessage(event.nativeEvent.data,data)}
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
        backgroundColor: '#F5FCFF',
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