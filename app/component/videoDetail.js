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
    TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"

const { width,height } = Dimensions.get('window');

type Props = {};
export default class VideoDetail extends Component<Props> {
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="视频教程"/>),
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
    render() {
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={{uri:`${this.props.navigation.getParam('data')}`}}
                    style={{width,flex:1}}
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
});