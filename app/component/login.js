/**
 * Created by lijiabin on 2018/5/12.
 */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View ,ImageBackground,TouchableOpacity,Button,AsyncStorage} from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
import WEBSITEURL from "../variable/websitURL"
import { createStackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';


export default class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            userName:"",
            password:"",
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
            headerTitle: (<LogoTitle title="登&nbsp;&nbsp;录"/>),
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
    userLogin(){
        that=this;
        console.log(`${WEBSITEURL}/login.php?username=${this.state.userName}&password=${this.state.password}`)
        fetch(`${WEBSITEURL}/login.php?username=${this.state.userName}&password=${this.state.password}`)
            .then(response=>response.json())
            .then(data=>{
                console.log(data);
                if (data.length==0){
                    alert("用户名或密码错误！");
                }else {
                    console.log(123456)
                    console.log(data[0]);
                    AsyncStorage.setItem("user",JSON.stringify(data[0]),function (err) {
                        if (err){
                            console.log("有错误");
                            console.log(err);
                        }else {
                            console.log("save ok");
                            that.props.navigation.popToTop();
                        }
                    })
                    /*this.props.navigation.navigate("Personal");*/
                }
            })
            .catch(error=>console.log(error))
    }
    render() {
        return (
                <View style={[styles.container]}>
                    <ImageBackground source={require("../../www/img/index_bg.jpg")} style={[styles.containerImage]}>
                    <Text style={styles.title}>登&nbsp;&nbsp;录</Text>
                    <Sae
                        label={'用户名'}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={'white'}
                        onChangeText = {(text)=> { this.setState({userName : text})}}
                    />
                    <Sae
                        secureTextEntry={true}
                        style={[styles.input,{marginBottom:40}]}
                        label={'密码'}
                        iconClass={FontAwesomeIcon}
                        onChangeText = {(text)=> { this.setState({password : text})}}
                    />
                        <Button onPress={()=>this.userLogin()} title="登&nbsp;&nbsp;&nbsp;&nbsp;录" color="#d7a55c"></Button>
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
        resizeMode:"cover",
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