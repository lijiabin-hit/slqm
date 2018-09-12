/**
 * Created by lijiabin on 2018/5/13.
 */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View ,ImageBackground,TouchableOpacity,Button,Image,AsyncStorage,} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import Toast, {DURATION} from 'react-native-easy-toast'
import ImagePicker from "react-native-image-picker"


export default class PersonalComponent extends Component {
    user={};
    constructor(props) {
        super(props);
        this.state={
            user:{},
            imageSource:{},
        }
    }
    options = {
        title: '请选择',
        quality: 0.8,
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '选择相册',
        allowsEditing: true,
        noData: false,
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="个人中心"/>),
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
    componentWillMount=function () {
        AsyncStorage.getItem("user")
            .then(data=>{
                if(data) {
                    this.setState({user:JSON.parse(data)});
                    this.setState({imageSource:{uri:`${WEBSITEURL}/img/${this.state.user.user_img}`}});
                    this.user=this.state.user;
                    console.log(12342321412)
                    console.log(this.state.imageSource)
                }
            })
    }
    loginOut(){
        AsyncStorage.removeItem("user")
            .then(()=>{
                this.setState({user:{}})
                this.refs.toast.show("登出成功！", DURATION.LENGTH_LONG);
                console.log("remove ok");
            })
    }
    pickPhoto(){
        ImagePicker.showImagePicker(this.options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response);
                let source = { uri: response.uri };
                this.setState({imageSource:{uri: response.uri}});

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let formData = new FormData();
                let d=new Date();
                let t=Date.parse(d);
                let file = {uri: response.uri, type: 'multipart/form-data', name: `${t}${this.state.user.ID}.jpg`};
                this.user.user_img=`${t}${this.state.user.ID}.jpg`;
                AsyncStorage.setItem("user",JSON.stringify(this.user),function (err) {
                    if (err){
                        console.log("有错误");
                        console.log(err);
                    }else {
                        console.log("save ok");
                    }
                })

                formData.append("photo",file);
                console.log(`${WEBSITEURL}/uploadPhoto.php?id=${this.state.user.ID}`);
                fetch(`${WEBSITEURL}/uploadPhoto.php?id=${this.state.user.ID}`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'multipart/form-data',
                    },
                    body:formData,
                })
                    .then((response) => response.text() )
                    .then((responseData)=>{

                        console.log('responseData',responseData);
                    })
                    .catch((error)=>{console.error('error',error)});

                // this.setState({
                //     avatarSource: source
                // });
            }
        });
    }
    render() {
        return (
            <View style={[styles.container]}>
                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                    <ScrollView style={{flex:1}}>
                        <View style={styles.TopView}>
                        <TouchableOpacity onPress={()=>this.pickPhoto()}>
                            <Image style={styles.ImageStyle} source={JSON.stringify(this.state.user)=="{}"?require("../../www/img/0.jpg"):this.state.imageSource}></Image>
                        </TouchableOpacity>
                            {JSON.stringify(this.state.user)=="{}"?<TouchableOpacity onPress={()=>this.props.navigation.navigate('Login')}  style={{marginLeft:8}}><Text>登录</Text></TouchableOpacity>:<Text>&nbsp;&nbsp;{this.state.user.user_login}</Text>}
                            {JSON.stringify(this.state.user)=="{}"?<Text>{"/"}</Text>:null}
                            {JSON.stringify(this.state.user)=="{}"?<TouchableOpacity onPress={()=>this.props.navigation.navigate('Register')} ><Text>注册</Text></TouchableOpacity>:null}
                        </View>
                        <TouchableOpacity onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.props.navigation.navigate('MyCollection',{uID:this.state.user.ID})}} style={[styles.Item,{marginTop:25}]}>
                            <Text><Icon name="md-bookmark" size={18}/>&nbsp;&nbsp;我的收藏</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.props.navigation.navigate('MyShareList',{uID:this.state.user.ID})}} style={styles.Item}>
                            <Text><Icon name="md-share" size={18}/>&nbsp;&nbsp;我的分享</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.props.navigation.navigate('MyCommentList',{uID:this.state.user.ID})}} style={styles.Item}>
                            <Text><Icon name="md-chatboxes" size={18}/>&nbsp;&nbsp;我的评论</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.props.navigation.navigate('MyCircleList',{uID:this.state.user.ID})}} style={styles.Item}>
                            <Text><Icon name="ios-book" size={18}/>&nbsp;&nbsp;我的学圈</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.props.navigation.navigate('MyRecordList',{uID:this.state.user.ID})}} style={styles.Item}>
                            <Text><Icon name="md-radio" size={18}/>&nbsp;&nbsp;我的录音</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('ShareList')} style={[styles.Item,{marginTop:25}]}>
                            <Text><Icon name="md-share" size={18}/>&nbsp;&nbsp;分享</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('RecordList')} style={[styles.Item]}>
                            <Text><Icon name="md-radio" size={18}/>&nbsp;&nbsp;录音</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('CircleList')} style={styles.Item}>
                            <Text><Icon name="ios-book" size={18}/>&nbsp;&nbsp;学圈</Text>
                            <Image style={styles.NextImage} source={require('../../www/img/nextgo.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.loginOut()} style={{height:40, backgroundColor:"red",marginTop:25,marginBottom:40,justifyContent:"center",}}>
                            <Text style={{textAlign:"center"}}>退&nbsp;出&nbsp;登&nbsp;录</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <Toast ref="toast" position="bottom" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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