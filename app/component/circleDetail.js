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

export default class CircleDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            circle:{},
            inCircle:false,
            user:{},
        }
    }
    componentDidMount=function(){
        console.log(`${WEBSITEURL}/circleDetail.php?id=${this.props.navigation.getParam("cID")}`);
        fetch(`${WEBSITEURL}/circleDetail.php?id=${this.props.navigation.getParam("cID")}`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({circle:responseJson});
                console.log(this.state.data)
            })
            .catch((error)=>{
                console.log(123+error)
            })
        AsyncStorage.getItem("user")
            .then(data=>{
                if(data) {
                    this.setState({user:JSON.parse(data)});
                    console.log(`${WEBSITEURL}/inCircle.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`)
                    fetch(`${WEBSITEURL}/inCircle.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`)
                        .then((response)=>response.text())
                        .then((responseText)=>{
                            if(responseText==1){
                                this.setState({inCircle:true})
                            }else {
                                this.setState({inCircle:false});
                            }
                            console.log(456)
                            console.log(this.state.inCircle);
                        })
                        .catch((error)=>{
                            console.log(123+error)
                        })
                }
            })
    }
    joinCircle(){
        fetch(`${WEBSITEURL}/collectCircle.php?uID=${this.state.user.ID}&cID=${this.props.navigation.getParam("cID")}`)
            .then((response)=>response.text())
            .then((responseText)=>{
                if(responseText==1){
                    this.setState({inCircle:true})
                    this.refs.toast.show("加入学圈成功！", DURATION.LENGTH_LONG);
                }else {
                    this.setState({inCircle:false});
                    this.refs.toast.show("加入学圈失败！", DURATION.LENGTH_LONG);
                }
                console.log(456)
                console.log(this.state.inCircle);
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
                // <Text>&lt;&lt;返回</Text>
                <Text>&nbsp;&nbsp;</Text>
            ),
        }
    }
    render() {
        AsyncStorage.getItem("user")
            .then(data=>{
                if(data) {
                    JSON.stringify(this.state.user)==data? null:this.setState({user:JSON.parse(data)});
                    console.log(123);
                    console.log(this.state.user);
                }
            })
        return (
            <View style={[styles.container]}>
                <ImageBackground source={require("../../www/img/content_bg.jpg")} style={styles.containerImage}>
                    <ScrollView style={{flex:1}}>
                        <Text style={styles.titleText}>{this.props.navigation.getParam("title")}</Text>
                        <Text style={styles.authorText}>{this.state.circle.date}&nbsp;&nbsp;&nbsp;作者：{this.state.circle.authorLogin}</Text>
                        <Text style={styles.contentText}>
                            {this.state.circle.content}
                        </Text>
                        <Button onPress={()=>{this.state.inCircle?this.props.navigation.navigate("CircleContent",{cID:this.props.navigation.getParam("cID"),title:this.props.navigation.getParam("title")}):JSON.stringify(this.state.user)=="{}"?this.props.navigation.navigate('Login'):this.joinCircle()}}
                                title={this.state.inCircle?"进入学圈":"加入学圈"}></Button>
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
    }
});