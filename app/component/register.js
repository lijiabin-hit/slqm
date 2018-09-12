/**
 * Created by lijiabin on 2018/5/12.
 */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View ,ImageBackground,TouchableOpacity,Button,AsyncStorage} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import WEBSITEURL from "../variable/websitURL"

import {
    Kaede,
    Hoshi,
    Jiro,
    Isao,
    Madoka,
    Akira,
    Hideo,
    Kohana,
    Makiko,
    Sae,
    Fumi,
} from 'react-native-textinput-effects';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import LogoRight from "./logoRight"
import { createStackNavigator } from 'react-navigation';

export default class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            userName:"",
            password1:"",
            password2:"",
            isReged:false,
            samePass:true,
            userNameFocus:false,
            password1Focus:false,
            password2Focus:false,
        }
    }
    componentWillMount=function () {
        AsyncStorage.getItem("user")
            .then(data=>{
                if(data) {
                    this.props.navigation.goBack();
                }
            })
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="注&nbsp;&nbsp;册"/>),
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <TouchableOpacity
                    onPress={()=>navigation.navigate('Personal')}><LogoRight/></TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack()}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
        }
    }
    isReged(){
        console.log(`${WEBSITEURL}/isReged.php?username=${this.state.userName}`);
        this.setState({userNameFocus : false});
        fetch(`${WEBSITEURL}/isReged.php?username=${this.state.userName}`)
            .then(response=>response.text())
            .then(data=>{
                console.log(data);
                if (data==0){
                    this.setState({isReged:false});
                }else {
                    this.setState({isReged:true});
                }
            })
            .catch(error=>console.log(error))
    }
    isSamePass(){
        this.setState({password2Focus : false})
        if (this.state.password1!==this.state.password2){
            this.setState({samePass:false});
        }
    }
    userRegister(event){
        if (this.state.samePass==false||this.state.isReged==true){
            return;
        }
        console.log(`${WEBSITEURL}/register.php?username=${this.state.userName}&password=${this.state.password1}`);
        fetch(`${WEBSITEURL}/register.php?username=${this.state.userName}&password=${this.state.password1}`)
            .then(response=>response.text())
            .then(data=>{
                if (data==0){
                    alert("未注册成功，请重新注册！");
                }else {
                    console.log(data);
                    this.props.navigation.navigate("Login");
                }
            })
            .catch(error=>console.log(error))
    }
    render() {
        return (
            <View style={[styles.container]}>
                <ImageBackground resizeMode="cover" source={require("../../www/img/index_bg.jpg")} style={[styles.containerImage]}>
                    <Text style={styles.title}>注&nbsp;&nbsp;册</Text>
                    <Sae
                        maxLength={8}
                        placeholder={this.state.userNameFocus?"请输入最多8个字符":""}
                        label={this.state.isReged?"用户名（该用户名已经被注册了！）":'用户名'}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={'white'}
                        onChangeText = {(text)=> { this.setState({userName : text})}}
                        onBlur={(e)=>{this.isReged()}}
                        onFocus={()=> { this.setState({userNameFocus : true})}}
                    />
                    <Sae
                        maxLength={12}
                        placeholder={this.state.password1Focus?"请输入最多12个字符":""}
                        secureTextEntry={true}
                        style={styles.input}
                        label={'密码'}
                        iconClass={FontAwesomeIcon}
                        onChangeText = {(text)=> { this.setState({password1 : text})}}
                        onFocus={()=> { this.setState({password1Focus : true})}}
                        onBlur={(e)=>{this.setState({password1Focus : false})}}
                    />
                    <Sae
                        maxLength={12}
                        placeholder={this.state.password2Focus?"请输入两次一样的密码":""}
                        secureTextEntry={true}
                        style={[styles.input,{marginBottom:40}]}
                        label={this.state.samePass?'重复密码':"重复密码(两次密码不一致)"}
                        iconClass={FontAwesomeIcon}
                        onChangeText = {(text)=> { this.setState({password2 : text})}}
                        onFocus={()=> { this.setState({password2Focus : true})}}
                        onBlur={(e)=>{this.isSamePass()}}
                    />
                    <Button onPress={(e)=>this.userRegister(e)} title="注&nbsp;&nbsp;&nbsp;&nbsp;册" color="#d7a55c"></Button>
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
        paddingTop: 24,
        backgroundColor: 'white',
    },
    content: {
        // not cool but good enough to make all inputs visible when keyboard is active
        paddingBottom: 300,
    },
    card2: {
        padding: 16,
    },
    input: {
        marginTop: 4,
    },
    title: {
        paddingBottom: 16,
        textAlign: 'center',
        color: '#404d5b',
        fontSize: 20,
        fontWeight: 'bold',
        opacity: 0.8,
    },
});