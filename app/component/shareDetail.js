/**
 * Created by lijiabin on 2018/5/13.
 */
import React, { Component } from 'react';
import { ScrollView,
    StyleSheet,
    Text,
    View ,
    ImageBackground,
    TouchableOpacity,
    Button,
    Image
    ,AsyncStorage,
    TextInput
} from 'react-native';
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast'

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"

export default class ShareDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            share:{},
            visible:false,
            isCollected:false,
            user:{},
            commentContent:"",
        }
    }
    componentDidMount=function() {
        fetch(`${WEBSITEURL}/ShareDetail.php?id=${this.props.navigation.getParam("sID")}`)
            .then((response)=>response.json())
            .then((responseJson)=> {
                this.setState({share: responseJson});
                console.log(789)
                console.log(this.state.share)
            })
            .catch((error)=> {
                console.log(123 + error)
            })
        AsyncStorage.getItem("user")
            .then(data=>{
                if(data) {
                    this.setState({user:JSON.parse(data)});
                    console.log(`${WEBSITEURL}/isShareCollected.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
                    fetch(`${WEBSITEURL}/isShareCollected.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
                        .then((response)=>response.text())
                        .then((responseText)=>{
                            if(responseText==1){
                                this.setState({isCollected:true})
                            }else {
                                this.setState({isCollected:false});
                            }
                            console.log(456)
                            console.log(this.state.isCollected);
                        })
                        .catch((error)=>{
                            console.log(123+error)
                        })
                }
            })
    }
    collectShare(){
        console.log(`${WEBSITEURL}/collectShare.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
        fetch(`${WEBSITEURL}/collectShare.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
            .then((response)=>response.text())
            .then((responseText)=>{
                if(responseText==1){
                    this.setState({isCollected:true})
                    this.refs.toast.show("收藏成功！", DURATION.LENGTH_LONG);
                }else {
                    this.setState({isCollected:false});
                    this.refs.toast.show("收藏失败！", DURATION.LENGTH_LONG);
                }
                console.log(456)
                console.log(this.state.isCollected);
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    deleteShareCollection(){
        console.log(`${WEBSITEURL}/deleteShareCollection.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
        fetch(`${WEBSITEURL}/deleteShareCollection.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`)
            .then((response)=>response.text())
            .then((responseText)=>{
                if(responseText==1){
                    this.setState({isCollected:false})
                    this.refs.toast.show("取消收藏成功！", DURATION.LENGTH_LONG);
                }else {
                    this.setState({isCollected:true});
                    this.refs.toast.show("取消收藏失败！", DURATION.LENGTH_LONG);
                }
                console.log(456)
                console.log(this.state.isCollected);
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    postComment(){
        fetch(`${WEBSITEURL}/postShareComment.php?uID=${this.state.user.ID}&sID=${this.props.navigation.getParam("sID")}`,{
            method:"post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `content=${this.state.commentContent}`
        })
            .then((response)=>response.text())
            .then((responseText)=>{
                if(responseText==1){
                    this.setState({commentContent:""});
                    this.refs.toast.show("发布成功！", DURATION.LENGTH_LONG);
                }else {
                    this.refs.toast.show("发布失败！", DURATION.LENGTH_LONG);
                }
                console.log(responseText);
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title={navigation.getParam("title")}/>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack(null)}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
            headerRight: (
                <Text>&nbsp;&nbsp;</Text>
            ),
        }
    }
    render() {
        return (
            <View style={[styles.container]}>
                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                    <ScrollView >
                        <Text style={styles.titleText}>{this.props.navigation.getParam("title")}</Text>
                        <Text style={styles.authorText}>{this.state.share.date}&nbsp;&nbsp;&nbsp;作者：{this.state.share.authorLogin}</Text>
                        <Text style={styles.contentText}>
                            {this.state.share.content}
                        </Text>
                    </ScrollView>
                    <View style={{backgroundColor:"#d7a55c",height:30,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{marginRight:10,marginLeft:10,}}><Text style={{textAlign:"center",color:"black"}}><Icon name="ios-arrow-back" style={{flex:1}} size={20} color="white"/></Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.refs.modal3.open()} style={{flex:10, borderColor:"black",borderWidth:1,height:20,borderRadius:5}}><TextInput placeholder="留下你此刻的想法..." editable={false} underlineColorAndroid="transparent" style={{fontSize:8,height:30,marginTop:-5,borderRadius:5}}/></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("ShareCommentList",{sID:this.props.navigation.getParam("sID")})} style={{marginRight:10,marginLeft:10,}}><Text style={{textAlign:"center",color:"white"}}><Icon name="md-chatboxes" style={{flex:1}} size={18} color="white"/></Text></TouchableOpacity>
                        {this.state.isCollected?<TouchableOpacity onPress={()=>this.deleteShareCollection()} style={{marginRight:10,marginLeft:10,}}><Text style={{textAlign:"center",color:"black"}}><Icon name="md-star" style={{flex:1}} size={20} color="white"/></Text></TouchableOpacity>:
                            <TouchableOpacity onPress={()=>this.collectShare()} style={{marginRight:10,marginLeft:10,}}><Text style={{textAlign:"center",color:"black"}}><Icon name="md-star-outline" style={{flex:1}} size={20} color="white"/></Text></TouchableOpacity>}
                    </View>
                </ImageBackground>
                <Modal style={[styles.modal, styles.modal3]} position={"bottom"} ref={"modal3"} isDisabled={this.state.isDisabled}>
                    <TextInput multiline = {true} placeholder="留下你此刻的想法..." value={this.state.commentContent} onChangeText={(text)=>this.setState({commentContent:text})} autoFocus={true} style={{textAlignVertical: 'top',flex:1,borderColor:"black",borderWidth:1,height:100,borderRadius:5,textDecoration:"none"}}/>
                    <Button title={"提交"} onPress={()=>this.postComment()} color="#d7a55c" style={{backgroundColor:"#d7a55c"}}></Button>
                </Modal>
                <Toast ref="toast" position="bottom" style={{backgroundColor:"#dade9f",borderRadius:6}}/>
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
    titleText:{
        fontSize:30,
        fontWeight:"bold",
        textAlign:"center",
        marginTop:15,
    },
    authorText:{
        fontSize:12,
        fontWeight:"100",
        marginTop:5,
        marginLeft:4,
    },
    contentText:{
        fontSize:20,
        marginTop:15,
        marginBottom:15,
        marginRight:6,
        marginLeft:6,
    },
    container2: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal3: {
        backgroundColor:"#ded2c2",
        height: 100,
        flexDirection:"row",
        borderRadius:5,
    },
});