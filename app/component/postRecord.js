/**
 * Created by lijiabin on 2018/5/23.
 */
import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
    Button,
    Image,
    AsyncStorage,
    TextInput,
} from 'react-native';

import Sound from 'react-native-sound';
import WEBSITEURL from "../variable/websitURL"
import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob'
import Toast, {DURATION} from 'react-native-easy-toast'

class PostRecord extends Component {

    state = {
        user:{},
        title:"",
        content:"",
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
    };

    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
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
        AsyncStorage.getItem("user")
            .then(data=> {
                if (data) {
                    this.setState({user: JSON.parse(data)});
                }
            })
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="发布录音"/>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack(null)}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
            headerRight: (
                <Text>&nbsp;&nbsp;</Text>
                // <Text>&lt;&lt;返回</Text>
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
            console.log(435450);
            console.log(filePath);
            return filePath;
        } catch (error) {
            console.error(error);
        }
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
        console.log(`${WEBSITEURL}/postRecord.php?uID=${this.state.user.ID}`);
        console.log(this.state.user)
        fetch(`${WEBSITEURL}/postRecord.php?uID=${this.state.user.ID}&cID=0`,{
            method:"post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `title=${this.state.title}&content=${this.state.content}&recordpath=${this.state.recordName}`
        })
            .then((response)=>response.text())
            .then((responseText)=>{
                console.log(responseText);
                if (responseText==1){
                    this.refs.toast.show("发布成功！", DURATION.LENGTH_LONG);
                    this.setState({title:"",content:""});
                    this.setState({recordOver:false,currentTime:0});
                }else {
                    this.refs.toast.show("发布失败！", DURATION.LENGTH_LONG);
                }

            }).catch((error)=>{
            console.log(123+error)
        })
    }
    componentWillUnmount=function () {
        this._stop();
    }
    render() {
        if (!this.state.recordOver){
            return (
                <View style={styles.container}>
                    <View style={styles.controls}>
                        {this._renderButton("录制", () => {this._record()}, this.state.recording )}
                        {this._renderButton("试听", () => {this._play()} )}
                        {this._renderButton("停止录制", () => {this._stop()} )}
                        {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
                        {this._renderPauseButton(() => {this.state.paused ? this._resume() : this._pause()})}
                        {this._renderButton("上传录音", () => {this._submitRecord()} )}
                        <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                        <Toast ref="toast" position="top" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
                    </View>
                </View>
            );
        }else {
            return(
                <View style={[styles.container]}>
                    <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                        <TextInput value={this.state.title} onChangeText={(text)=>this.setState({title:text})} placeholder="录音题目" underlineColorAndroid="transparent" style={{ marginRight:20,marginLeft:20,marginTop:30,marginBottom:10, borderColor:"black",borderWidth:1,borderRadius:5}}/>
                        <TextInput value={this.state.content} onChangeText={(text)=>this.setState({content:text})} multiline = {true} placeholder="录音介绍" style={{marginRight:20,marginLeft:20,marginTop:10,marginBottom:10,textAlignVertical: 'top',borderColor:"black",borderWidth:1,height:300,borderRadius:5,}}/>
                        <View style={{marginRight:50,marginLeft:50}}><Button onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate("Login"):this.submitRecordText()}} style={{marginRight:30,marginLeft:30,width:100}} color="#d7a55c"  title={"提交"}></Button></View>
                        <Toast ref="toast" position="bottom" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
                    </ImageBackground>
                </View>
            )
        }
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cf9b50",
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
    containerImage: {
        flex: 1,
        backgroundColor: 'white',
    },
    TopView:{
        height:80,
        backgroundColor:"#f1e7cb",
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:20,
    },
    ImageStyle:{
        height:55,
        width:55,
        borderRadius:55,
    },
    Item:{
        height:50,
        backgroundColor:"#b3ba99",
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#9faa88",
        alignItems:"center",
        justifyContent:"space-between",
        paddingLeft:10,
        paddingRight:10,
    },
    NextImage:{
        width:27,
        height:27,
    }

});

export default PostRecord;