/**
 * Created by lijiabin on 2018/5/13.
 */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View ,ImageBackground,TouchableOpacity,Button,Image,AsyncStorage,TextInput,} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import Toast, {DURATION} from 'react-native-easy-toast'


export default class PostCircle extends Component {
    constructor(props) {
        super(props);
        this.state={
            user:{},
            title:"",
            content:"",
        }
    }
    componentDidMount=function() {
        AsyncStorage.getItem("user")
            .then(data=> {
                if (data) {
                    this.setState({user: JSON.parse(data)});
                }
            })
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="创建学圈"/>),
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
    submitText(){
        console.log(`${WEBSITEURL}/postCircle.php?uID=${this.state.user.ID}`);
        console.log(this.state.user)
        fetch(`${WEBSITEURL}/postCircle.php?uID=${this.state.user.ID}`,{
            method:"post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `title=${this.state.title}&content=${this.state.content}`
        })
            .then((response)=>response.text())
            .then((responseText)=>{
                console.log(responseText);
                if (responseText==1){
                    this.refs.toast.show("发布成功！", DURATION.LENGTH_LONG);
                    this.setState({title:"",content:""});
                }else {
                    this.refs.toast.show("发布失败！", DURATION.LENGTH_LONG);
                }

            }).catch((error)=>{
            console.log(123+error)
        })
    }
    render() {
        return (
            <View style={[styles.container]}>
                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                    <TextInput value={this.state.title} onChangeText={(text)=>this.setState({title:text})} placeholder="学圈名称" underlineColorAndroid="transparent" style={{ marginRight:20,marginLeft:20,marginTop:30,marginBottom:10, borderColor:"black",borderWidth:1,borderRadius:5}}/>
                    <TextInput value={this.state.content} onChangeText={(text)=>this.setState({content:text})} multiline = {true} placeholder="学圈介绍" style={{marginRight:20,marginLeft:20,marginTop:10,marginBottom:10,textAlignVertical: 'top',borderColor:"black",borderWidth:1,height:300,borderRadius:5,}}/>
                    <View style={{marginRight:50,marginLeft:50}}><Button onPress={()=>{JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate("Login"):this.submitText()}} style={{marginRight:30,marginLeft:30,width:100}} color="#d7a55c"  title={"提交"}></Button></View>
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