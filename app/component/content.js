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
    Image,
    Button,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"
import AwesomeAlert from 'react-native-awesome-alerts';

type Props = {};
const { width,height } = Dimensions.get('window');
var Sound=require('react-native-sound');
Sound.setCategory('Playback');
var Music=new Sound('background.mp3',Sound.MAIN_BUNDLE,(error)=> {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    Music.play();
    Music.setNumberOfLoops(-1);
    Music.setVolume(0.5);
    console.log('duration in seconds: ' + Music.getDuration() + 'number of channels: ' + Music.getNumberOfChannels());
});
// class LogoTitle extends React.Component {
//     render() {
//         return (
//             <View style={{flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
//                 <View style={{flex:1}}><Text style={{textAlign: 'center',}}>{this.props.title}</Text></View>
//             </View>
//             // <Text style={{textAlign:"center"}}>一东</Text>
//         );
//     }
// }
// class LogoRight extends React.Component{
//     render(){
//         return(
//             <Text><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
//         )
//     }
// }
// class LogoLeft extends React.Component{
//     render(){
//         return(
//             <Text><Icon name="ios-arrow-back" size={15} color="black"/><Icon name="ios-arrow-back" size={15} color="black"/>返回</Text>
//         )
//     }
// }
class MusicComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isPlaying:false,
        }
        // alert(this.props.url1);
        // this.SoundMusic.stop();
        // this.SoundMusic.release();
    }
    SoundMusic=new Sound(this.props.url1,Sound.MAIN_BUNDLE,(error)=> {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        // this.SoundMusic.play();
        // loaded successfully
        console.log('duration in seconds: ' +this.SoundMusic.getDuration() + 'number of channels: ' + this.SoundMusic.getNumberOfChannels());
    });
    PlaySound(){
        this.setState({
            isPlaying:true,
        });
        this.SoundMusic.play((success) => {
                    if (success) {
                        this.setState({
                            isPlaying:false,
                        });
                    } else {
                        console.log('playback failed due to audio decoding errors');
                        // reset the player to its uninitialized state (android only)
                        // this is the only option to recover after an error occured and use the player again
                        Music.reset();
                    }
                });
        // alert(this.props.url1+this.state.isPlaying+this.state.isNext);
    };
    PauseSound(){
        this.setState({
            isPlaying:false,
        });
        this.SoundMusic.pause();
        // alert(this.props.url1+this.state.isPlaying+this.state.isNext);
    }
    url=this.props.url1;
    ChangeMusic(){
        this.SoundMusic.stop().reset().release();
        this.SoundMusic=new Sound(this.props.url1,Sound.MAIN_BUNDLE,(error)=> {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // this.SoundMusic.play();
            // loaded successfully
            console.log('duration in seconds: ' +this.SoundMusic.getDuration() + 'number of channels: ' + this.SoundMusic.getNumberOfChannels());
        });
        this.url=this.props.url1;
        this.setState({
            isPlaying:false,
            // isNext:false
        });
    }
    componentWillUnmount=function () {
        this.SoundMusic.stop().reset().release();
    }

    // dowithState(){
    //     this.setState({
    //         isPlaying:!this.state.isPlaying,
    //     })
    // }
    render(){
        this.url==this.props.url1?null:this.ChangeMusic();
        // this.url==this.props.url1?null:this.url=this.props.url;
        return(
            this.state.isPlaying?<TouchableOpacity
                onPress={()=>{this.PauseSound()}}
                style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image style={{flex:1,width:40,height:40}} source={require('../../www/img/pause.png')}>
                </Image>
            </TouchableOpacity>:<TouchableOpacity
                onPress={()=>{this.PlaySound()}}
                style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image style={{flex:1,width:40,height:40}} source={require('../../www/img/play.png')}>
                </Image>
            </TouchableOpacity>
        )
    }
}


export default class ContentComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={
            isNext:false,
            showAlert: false,
            AlertNum:0,
        }
    }
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
    dowithMessage(data){
        this.props.navigation.navigate('Detail',{data:data});
    }
    dowithNext(){
        const { params } = this.props.navigation.state;
        const data = params ? params.data : null;
        this.setState({AlertNum:0,showAlert:false});
        this.props.navigation.setParams({ data: Number(data)+1 })
    }
    dowithPre(){
        const { params } = this.props.navigation.state;
        const data = params ? params.data : null;
        this.setState({AlertNum:0,showAlert:false});
        this.props.navigation.setParams({ data: Number(data)-1 })
    }
    render() {
        const { params } = this.props.navigation.state;
        const data = params ? params.data : null;
        // const url = JSON.stringify(params.data);
        let url="../../www/content1.html";
        // url;
        console.log(`file:///android_asset/www/content${data}.html`);
        return (
            <View style={styles.container}>
                {/*<Text>asfljasl</Text>*/}

                <WebView
                    automaticallyAdjustContentInsets={true}
                    source={{uri:`file:///android_asset/www/content${data}.html`}}
                    style={{width,marginTop:-40,}}
                    onMessage={(event)=>this.dowithMessage(event.nativeEvent.data)}
                >

                </WebView>
                <View style={{backgroundColor: '#cd994e',height:40,flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>this.props.navigation.navigate("Test",{data:data})}>
                        <Text style={{textAlign: 'center',}}>测试本章</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>{data==0?this.setState({AlertNum:0,showAlert:true}):this.dowithPre()}}
                        style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{flex:1,width:35,height:35}} source={require('../../www/img/pre.png')}>
                        </Image>
                    </TouchableOpacity>
                    <MusicComponent url1={data==1?"top1.mp3":
                        data==2?"top2.mp3":
                            data==3?"top3.mp3":
                                data==4?"top4.mp3":
                                    data==5?"top5.mp3":
                                        data==6?"top6.mp3":
                                            data==7?"top7.mp3":
                                                data==8?"top8.mp3":
                                                    data==9?"top9.mp3":
                                                        data==10?"top10.mp3":
                                                            data==11?"top11.mp3":
                                                                data==12?"top12.mp3":
                                                                    data==13?"top13.mp3":
                                                                        data==14?"top14.mp3":
                                                                            data==15?"top15.mp3":
                                                                                data==16?"top16.mp3":
                                                                                    data==17?"top17.mp3":
                                                                                        data==18?"top18.mp3":
                                                                                            data==19?"top19.mp3":
                                                                                                data==20?"top20.mp3":
                                                                                                    data==21?"top21.mp3":
                                                                                                        data==22?"top22.mp3":
                                                                                                            data==23?"top23.mp3":
                                                                                                                data==24?"top24.mp3":
                                                                                                                    data==25?"top25.mp3":
                                                                                                                        data==26?"top26.mp3":
                                                                                                                            data==27?"top27.mp3":
                                                                                                                                data==28?"top28.mp3":
                                                                                                                                    data==29?"top29.mp3":
                                                                                                                                        data==30?"top30.mp3":
                                                                                                                                            "null"}
                                    isNext={this.state.isNext}/>
                    <TouchableOpacity
                        onPress={() =>{data==30?this.setState({AlertNum:1,showAlert:true}):this.dowithNext()}}
                        style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{flex:1,width:35,height:35}} source={require('../../www/img/next.png')}>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('VideoList',{data:data})} style={{flex:1}}><Text style={{textAlign: 'center',}}>视频教程</Text></TouchableOpacity>
                </View>
                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    message={this.state.AlertNum==0?"这已经是第一章了!":"这已经是最后一章了！"}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                />
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
    }
});