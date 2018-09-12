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
    Image,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"

const { width,height } = Dimensions.get('window');

type Props = {};
export default class VideoList extends Component<Props> {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        const data = params ? params.data : null;
        return {
            headerTitle: data==0?<LogoTitle title="绪&nbsp;&nbsp;论"/>:
                data==1?<LogoTitle title="一&nbsp;&nbsp;东"/>:
                    data==2?<LogoTitle title="二&nbsp;&nbsp;冬"/>:
                        data==3?<LogoTitle title="三&nbsp;&nbsp;江"/>:
                            data==4?<LogoTitle title="四&nbsp;&nbsp;支"/>:
                                data==5?<LogoTitle title="五&nbsp;&nbsp;微"/>:
                                    data==6?<LogoTitle title="六&nbsp;&nbsp;鱼"/>:
                                        data==7?<LogoTitle title="七&nbsp;&nbsp;虞"/>:
                                            data==8?<LogoTitle title="八&nbsp;&nbsp;齐"/>:
                                                data==9?<LogoTitle title="九&nbsp;&nbsp;佳"/>:
                                                    data==10?<LogoTitle title="十&nbsp;&nbsp;灰"/>:
                                                        data==11?<LogoTitle title="十一真"/>:
                                                            data==12?<LogoTitle title="十二文"/>:
                                                                data==13?<LogoTitle title="十三元"/>:
                                                                    data==14?<LogoTitle title="十四寒"/>:
                                                                        data==15?<LogoTitle title="十五删"/>:
                                                                            data==16?<LogoTitle title="一&nbsp;&nbsp;先"/>:
                                                                                data==17?<LogoTitle title="二&nbsp;&nbsp;萧"/>:
                                                                                    data==18?<LogoTitle title="三&nbsp;&nbsp;肴"/>:
                                                                                        data==19?<LogoTitle title="四&nbsp;&nbsp;豪"/>:
                                                                                            data==20?<LogoTitle title="五&nbsp;&nbsp;歌"/>:
                                                                                                data==21?<LogoTitle title="六&nbsp;&nbsp;麻"/>:
                                                                                                    data==22?<LogoTitle title="七&nbsp;&nbsp;阳"/>:
                                                                                                        data==23?<LogoTitle title="八&nbsp;&nbsp;庚"/>:
                                                                                                            data==24?<LogoTitle title="九&nbsp;&nbsp;青"/>:
                                                                                                                data==25?<LogoTitle title="十&nbsp;&nbsp;蒸"/>:
                                                                                                                    data==26?<LogoTitle title="十一尤"/>:
                                                                                                                        data==27?<LogoTitle title="十二侵"/>:
                                                                                                                            data==28?<LogoTitle title="十三覃"/>:
                                                                                                                                data==29?<LogoTitle title="十四盐"/>:
                                                                                                                                    data==30?<LogoTitle title="十五咸"/>:
                                                                                                                                        <LogoTitle title="十五咸"/>,
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Users')}><LogoRight/></TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack(null)}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
        }
    };
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#d7a55c',}}>
                {/*<Text>asfljasl</Text>*/}
                <View style={{width,flexDirection:"row",height:150,padding:6}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('VideoDetail',{data:"https://v.qq.com/x/page/l0399697w91.html"})} style={{flex:1,width:width*0.5-9,marginRight:6}}>
                        <Image source={{uri:`www_img_video1`}} style={{flex:1,width:width*0.5-9,height:150}}></Image>
                        <Text>赵伟东 新讲《声律启蒙》第一讲《晚钓之翁》</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('VideoDetail',{data:"https://v.qq.com/x/page/u05019f9j6k.html"})} style={{flex:1,width:width*0.5-9}}>
                        <Image source={{uri:`www_img_video2`}} style={{flex:1,width:width*0.5-9,height:150}}></Image>
                        <Text>赵伟东 新讲《声律启蒙》第二讲《汉皇置酒》</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width,flexDirection:"row",height:150,padding:6}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('VideoDetail',{data:"https://v.qq.com/x/page/u05041ulxoh.html"})} style={{flex:1,width:width*0.5-9,marginRight:6}}>
                        <Image source={{uri:`www_img_video3`}} style={{flex:1,width:width*0.5-9,height:150}}></Image>
                        <Text style={{width:width*0.5-9}}>赵伟东 新讲《声律启蒙》第三讲《万丈长虹》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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