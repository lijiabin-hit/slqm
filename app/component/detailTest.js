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

type Props = {};
export default class DetailTest extends Component<Props> {
    static navigationOptions =({ navigation, navigationOptions }) =>{
        const { params } = navigation.state;
        const type = params ? params.type : null;
        const data = params ? params.data : null;
        return {
            headerTitle: type=="write"?<LogoTitle title="文字测试"/>:<LogoTitle title="拼图测试"/>,
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
        alert(type);
        this.props.navigation.navigate('DetailTest',{type:type,data:data});
    }
    render() {
        const { params } = this.props.navigation.state;
        const type = params ? params.type : null;
        const data = params ? params.data : null;
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={type=="write"?{uri:'file:///android_asset/www/write_test.html'}:{uri:"file:///android_asset/www/test.html"}}
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