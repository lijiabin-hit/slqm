/**
 * Created by lijiabin on 2018/5/14.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    ScrollView,
    StyleSheet,
    Text,
    View ,
    ImageBackground,
    Platform,
    TouchableOpacity,
    PermissionsAndroid,
    Button,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableHighlight,
    TextInput,
    AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob'
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import RefreshableFlatList from 'react-native-refreshable-flatlist';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Toast, {DURATION} from 'react-native-easy-toast'
import {SlidingPane, SlidingPaneWrapper} from 'react-native-sliding-panes';

const { width } = Dimensions.get('window');
export default class PostCircleContent extends Component {
    state = {
        user:{},
        shareTitle:"",
        shareContent:"",
        isWhere:1,
        recordTitle:"",
        recordContent:"",
        recordOver:false,
        recordName:"",
        recordPath:"",
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        hasPermission: undefined,
    }
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }
    componentDidMount=function(){
        this._checkPermission().then((hasPermission) => {
            this.setState({ hasPermission });

            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL);
                }
            };
        });
        this.setupSlidingPanes();
        AsyncStorage.getItem("user")
            .then(data=> {
                if (data) {
                    this.setState({user: JSON.parse(data)});
                }
            })
    }
    submitShare(){
        console.log(`${WEBSITEURL}/postShare.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`);
        console.log(this.state.user)
        fetch(`${WEBSITEURL}/postShare.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`,{
            method:"post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `title=${this.state.shareTitle}&content=${this.state.shareContent}`
        })
            .then((response)=>response.text())
            .then((responseText)=>{
                console.log(responseText);
                if (responseText==1){
                    this.refs.toast.show("发布成功！", DURATION.LENGTH_LONG);
                    this.setState({shareTitle:"",shareContent:""});
                }else {
                    this.refs.toast.show("发布失败！", DURATION.LENGTH_LONG);
                }

            }).catch((error)=>{
            console.log(123+error)
        })
    }
    setupSlidingPanes() {
        this.pane1.warpCenter();
        this.pane2.warpRight();
        this.slidingPaneWrapper.childPanes = [this.pane1, this.pane2];
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title={navigation.getParam("title")}/>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack()}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <Text>&nbsp;&nbsp;</Text>
            ),
        }
    }
    _checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'AudioExample needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                console.log('Permission result:', result);
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
    }
    _renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }
    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }
    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }
    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }
    _renderPauseButton(onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;
        var title = this.state.paused ? "继续录制" : "暂停录制";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }
    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }
    async _record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }
    _finishRecording(didSucceed, filePath) {
        this.setState({ finished: didSucceed,recordPath:filePath });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }
    _submitRecord(){
        let d=new Date();
        let t=Date.parse(d);
        var fileName=`${t}${this.state.user.ID}.acc`
        RNFetchBlob.fetch('POST', `${WEBSITEURL}/uploadAudio.php`, {
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
        }, [
            // part file from storage
            // elements without property `filename` will be sent as plain text
            { name : 'audio', filename : fileName, data : RNFetchBlob.wrap(this.state.recordPath)},
        ]).then((resp) => {
            // ...
            console.log(resp);
        }).catch((err) => {
            // ...
            console.log(err);
        })
        this.setState({recordName:fileName,recordOver:true});
        console.log(this.state);
    }
    submitRecordText(){
        console.log(`${WEBSITEURL}/postRecord.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`);
        console.log(this.state.user)
        fetch(`${WEBSITEURL}/postRecord.php?uID=${this.state.user.ID}&&cID=${this.props.navigation.getParam("cID")}`,{
            method:"post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `title=${this.state.recordTitle}&content=${this.state.recordContent}&recordpath=${this.state.recordName}`
        })
            .then((response)=>response.text())
            .then((responseText)=>{
                console.log(responseText);
                if (responseText==1){
                    this.refs.toast1.show("发布成功！", DURATION.LENGTH_LONG);
                    this.setState({recordTitle:"",recordContent:""});
                    this.setState({recordOver:false,currentTime:0,});
                }else {
                    this.refs.toast1.show("发布失败！", DURATION.LENGTH_LONG);
                }

            }).catch((error)=>{
            console.log(123+error)
        })
    }
    render() {
        const swipe_config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        let navLinkClicked = (text) => {
            switch (text) {
                case '发布分享':
                    this.setState({isWhere:1});
                    this.slidingPaneWrapper.setActive(0);
                    break;
                case '发布录音':
                    this.setState({isWhere:2});
                    this.slidingPaneWrapper.setActive(1);
                    break;
            }
        };

        const onSwipe = (gestureName, gestureState) => {
            const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
            switch (gestureName) {
                case SWIPE_LEFT:
                    this.setState({isWhere:2});
                    this.slidingPaneWrapper.slideAllLeft();
                    break;
                case SWIPE_RIGHT:
                    this.setState({isWhere:1});
                    this.slidingPaneWrapper.slideAllRight();
                    break;
                default:
                    break;
            }
        };
        componentWillUnmount=function () {
            this._stop();
        }
        let renderNavBarButton = (text, additional_styles,textStyle) => {
            return  <TouchableOpacity style={ [styles.navLink, additional_styles] }
                                      onPress={() => {navLinkClicked(text)}}>
                <View style={ { flexDirection: 'row' } }>
                    <Text style={[styles.navLinkText,textStyle]}>{text}</Text>
                </View>
            </TouchableOpacity>
        };
        return (
            <View style={styles.container}>
                <GestureRecognizer
                    onSwipe={(direction, state) => onSwipe(direction, state)}
                    config={swipe_config}>
                    <View style={{ width: '100%' }}>
                        <View style={styles.navBarBuffer} />
                        <View style={styles.navBar}>
                            { this.state.isWhere==1?renderNavBarButton('发布分享', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"#d7a55c"}):renderNavBarButton('发布分享', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"white"}) }
                            { this.state.isWhere==2?renderNavBarButton('发布录音', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"#d7a55c"}):renderNavBarButton('发布录音', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"white"}) }
                        </View>
                    </View>
                    <SlidingPaneWrapper style={{}} ref={(slidingPaneWrapper) => { this.slidingPaneWrapper = slidingPaneWrapper }}>
                        <SlidingPane style={[{borderColor: '#d7a55c', borderWidth: 2}]}
                                     ref={ (pane1) => { this.pane1 = pane1} }>
                            <View style={[styles.container1]}>
                                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                                    <TextInput value={this.state.shareTitle} onChangeText={(text)=>this.setState({shareTitle:text})} placeholder="分享题目" underlineColorAndroid="transparent" style={{ marginRight:20,marginLeft:20,marginTop:30,marginBottom:10, borderColor:"black",borderWidth:1,borderRadius:5}}/>
                                    <TextInput value={this.state.shareContent} onChangeText={(text)=>this.setState({shareContent:text})} multiline = {true} placeholder="分享内容" style={{marginRight:20,marginLeft:20,marginTop:10,marginBottom:10,textAlignVertical: 'top',borderColor:"black",borderWidth:1,height:300,borderRadius:5,}}/>
                                    <View style={{marginRight:50,marginLeft:50}}><Button onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate("Login"):this.submitShare()}} style={{marginRight:30,marginLeft:30,width:100}} color="#d7a55c"  title={"提交"}></Button></View>
                                    <Toast ref="toast" position="top" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
                                </ImageBackground>
                            </View>
                        </SlidingPane>
                        <SlidingPane style={[{borderColor: '#d7a55c', borderWidth: 2}]}
                                     ref={ (pane2) => { this.pane2 = pane2} }>
                            {this.state.recordOver?<View style={[styles.container1]}>
                                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                                    <TextInput value={this.state.recordTitle} onChangeText={(text)=>this.setState({recordTitle:text})} placeholder="录音题目" underlineColorAndroid="transparent" style={{ marginRight:20,marginLeft:20,marginTop:30,marginBottom:10, borderColor:"black",borderWidth:1,borderRadius:5}}/>
                                    <TextInput value={this.state.recordContent} onChangeText={(text)=>this.setState({recordContent:text})} multiline = {true} placeholder="录音介绍" style={{marginRight:20,marginLeft:20,marginTop:10,marginBottom:10,textAlignVertical: 'top',borderColor:"black",borderWidth:1,height:300,borderRadius:5,}}/>
                                    <View style={{marginRight:50,marginLeft:50}}><Button onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate("Login"):this.submitRecordText()}} style={{marginRight:30,marginLeft:30,width:100}} color="#d7a55c"  title={"提交"}></Button></View>
                                    <Toast ref="toast1" position="top" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
                                </ImageBackground>
                            </View>:<View style={styles.container1}>
                                <View style={styles.controls}>
                                    {this._renderButton("录制", () => {this._record()}, this.state.recording )}
                                    {this._renderButton("试听", () => {this._play()} )}
                                    {this._renderButton("停止录制", () => {this._stop()} )}
                                    {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
                                    {this._renderPauseButton(() => {this.state.paused ? this._resume() : this._pause()})}
                                    {this._renderButton("上传录音", () => {this._submitRecord()} )}
                                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                                </View>
                            </View>}
                        </SlidingPane>
                    </SlidingPaneWrapper>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#cf9b50',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8ECC2'
    },
    containerImage: {
        flex: 1,
        resizeMode:"cover",
        backgroundColor: 'white',
    },
    Item:{
        height:70,
        backgroundColor:"#dade9f",
        borderBottomWidth:1,
        borderBottomColor:"#A7A7A7",
        alignItems:"flex-start",
        justifyContent:"space-around",
        paddingLeft:10,
        paddingRight:10,
    },
    ItemAuthor:{
        flexDirection:"row",
        alignItems:"center",
    },
    NextImage:{
        width:15,
        height:15,
        borderRadius:15,
    },
    navBarBuffer: {
    },
    navBar: {
        height: 35,
        backgroundColor: '#ded2c2',
        width: '100%',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 1,
        borderTopColor: '#DDDDDD',
        borderTopWidth: 1,
        flexDirection: 'row'
    },
    navLink: {
        flex: 1,
        alignItems: 'center'
    },
    navLinkText: {
        paddingTop: 10,
        paddingBottom: 10
    },
    paneText: {
        fontSize: 22
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    },
});