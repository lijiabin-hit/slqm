/**
 * Created by lijiabin on 2018/5/7.
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
    Image,
    Dimensions,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"
import SlidingUpPanel from 'rn-sliding-up-panel';

const { width,height } = Dimensions.get('window');
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class DetailComponent extends Component<Props> {
    state={
        visible:false
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title=" "/>),
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
        const { params } = this.props.navigation.state;
        const data = params ? params.data : null;
        console.log(Dimensions.get('window'))
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={{uri:`file:///android_asset/www/detail${data}.html`}}
                    style={{width,marginTop:-5,}}
                    onMessage={(event)=>this.setState({visible:true})}
                >
                </WebView>
                <SlidingUpPanel
                    draggableRange={{top:height,bottom:0}}
                    visible={this.state.visible}
                                onRequestClose={()=>this.setState({visible:false})}
                >
                    <View style={styles.container2}>
                        <View style={{flex:1,padding:0,paddingRight:30,paddingLeft:30,marginTop:40}}>
                            <Image style={[styles.imgstyle,{width}]} resizeMode="contain" source={{uri:`www_img_${data}_1`}}></Image>
                        </View>
                       <View style={{flex:1,padding:0,paddingRight:30,paddingLeft:30,marginTop:-10}}>
                           <Image style={[styles.imgstyle,{width}]} resizeMode="contain"
                               source={{uri:`www_img_${data}_2`}}></Image>
                           </View>
                    </View>
                </SlidingUpPanel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        height:height,
        marginTop:-40,
        padding:5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    imgstyle:{
        flex:1,
    }
});