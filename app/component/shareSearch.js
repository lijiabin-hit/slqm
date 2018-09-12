/**
 * Created by lijiabin on 2018/5/24.
 */
import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View ,
    ImageBackground,
    TouchableOpacity,
    Button,
    Image,
    Dimensions,
    ActivityIndicator,
    TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import RefreshableFlatList from 'react-native-refreshable-flatlist';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

const { width } = Dimensions.get('window');
class SearchList extends Component{
    state = {
        data: new Array(),
        loadingVisible:true,
        loadedState:false,
        content:'',
    }
    componentDidMount=function(){
        console.log(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`);
        fetch(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({data:responseJson,loadingVisible:false});
                console.log(this.state.data)
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    componentWillReceiveProps=function () {
        console.log(this.props.content)
        this.setState({content:this.props.content});
        console.log(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`);
        fetch(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({data:responseJson,loadingVisible:false});
                console.log(this.state.data)
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    componentWillUpdate=function () {
        console.log(123);
        console.log(this.props.content)
        if (this.state.content!=this.props.content) {
            this.setState({content: this.props.content});
            console.log(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`);
            fetch(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`)
                .then((response)=>response.json())
                .then((responseJson)=> {
                    this.setState({data: responseJson, loadingVisible: false});
                    console.log(this.state.data)
                })
                .catch((error)=> {
                    console.log(123 + error)
                })
        }
    }
    render() {
        console.log(this.state.data);
        return (
            <View style={styles.container}>
                <RefreshableFlatList
                    topIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><ActivityIndicator color="#0000ff" /></View>}
                    bottomIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><Text>{this.state.loadedState?"已经到底了！":"加载中..."}</Text></View>}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={()=>this.props.that.props.navigation.navigate("ShareDetail",{sID:item.id,title:item.title})} key={item.id} style={styles.Item}>
                            <Text style={{fontSize:16,fontWeight:"bold"}}  numberOfLines={1}>{item.title}</Text>
                            <View style={styles.ItemAuthor}>
                                <Image style={styles.NextImage} source={{uri:`${WEBSITEURL}/img/${item.authorImg}`}}></Image>
                                <Text style={{fontSize:10}}>{item.authorLogin}</Text>
                                <Text style={{fontSize:10}}>分享于{item.date}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                <Text style={{fontSize:10}}><Icon name="md-chatboxes" size={12}/>&nbsp;&nbsp;{item.commentCount}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ref={(ref) => { this.flatList = ref; }}
                    onRefreshing={() => new Promise((r) => {
                        setTimeout(() => {
                            fetch(`${WEBSITEURL}/SearchshareList.php?id=0&content=${this.props.content}`)
                                .then((response)=>response.json())
                                .then((responseJson)=>{
                                    this.setState({data:responseJson});
                                    console.log(responseJson)
                                })
                                .catch((error)=>{
                                    console.log(123+error)
                                })
                            r();
                        }, 1500);
                    })}
                    onLoadMore={() => new Promise((r) => {
                        setTimeout(() => {
                            const no = this.state.data.length;
                            console.log(`${WEBSITEURL}/SearchshareList.php?id=${no}&content=${this.props.content}`);
                            fetch(`${WEBSITEURL}/SearchshareList.php?id=${no}&content=${this.props.content}`)
                                .then((response)=>response.json())
                                .then((responseJson)=>{
                                    responseJson.length==0?this.setState({loadedState:true}):this.setState({ data: this.state.data.concat(responseJson) });
                                    console.log(responseJson)
                                })
                                .catch((error)=>{
                                    console.log(123+error)
                                })

                            console.log("1234");
                            r();
                        }, 1500);
                    })}
                    keyExtractor={item => item.id}
                    styles={{ prompt: { color: 'gray' } }}
                />
                <OrientationLoadingOverlay
                    visible={this.state.loadingVisible}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Loading..."
                />
            </View>
        );
    }
}
export default class ShareSearch extends Component {
    state={
        content:""
    }

    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (
                <View style={{flex:1,barderColor:"black",borderWidth:1,marginTop:2,marginBottom:2,marginRight:3,borderRadius:5,height:26,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                    <Text>&nbsp;&nbsp;</Text>
                    <Icon name="md-search" size={16} color="white"/>
                    <Text>&nbsp;&nbsp;|&nbsp;</Text>
                    <TextInput placeholder="输入你想搜索的内容..." onChangeText={(text)=>{navigation.setParams({content:text});console.log(text)}} underlineColorAndroid="transparent" style={{flex:1,fontSize:12,height:50}}/>
                </View>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack(null)}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
        }
    }
    render(){
        console.log(this.props.navigation.getParam("content"));
        return(<SearchList content={this.props.navigation.getParam("content")} that={this}/>)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ded2c2',
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
    row: {
        padding: 10,
        height: 125,
        width,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        marginBottom: -1,
        borderBottomColor: '#E5EDF5',
        borderTopColor: '#E5EDF5',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        color: '#6da3d0'
    },
});