/**
 * Created by lijiabin on 2018/5/14.
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
    AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import RefreshableFlatList from 'react-native-refreshable-flatlist';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

const { width } = Dimensions.get('window');
export default class CircleList extends Component {
    state = {
        data: new Array(),
        loadingVisible:true,
        loadedState:false,
    }
    componentDidMount=function(){
        console.log(`${WEBSITEURL}/circleList.php?id=0`)
        fetch(`${WEBSITEURL}/circleList.php?id=0`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({data:responseJson,loadingVisible:false});
                console.log(this.state.data)
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title="学&nbsp;&nbsp;圈"/>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack()}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('CircleSearch',{content:""})}><Text><Icon name="md-search" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate('PostCircle')}><Text><Icon name="md-add" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text></TouchableOpacity>
                </View>
            ),
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
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("CircleDetail",{cID:item.id,title:item.title})} key={item.id} style={styles.Item}>
                            <Text style={{fontSize:16,fontWeight:"bold"}}  numberOfLines={1}>{item.title}</Text>
                            <View style={styles.ItemAuthor}>
                                <Image style={styles.NextImage} source={{uri:`${WEBSITEURL}/img/${item.authorImg}`}}></Image>
                                <Text style={{fontSize:10}}>{item.authorLogin}</Text>
                                <Text style={{fontSize:10}}>创建于{item.date}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                <Text style={{fontSize:10}}><Icon name="md-share" size={12}/>&nbsp;&nbsp;{item.shareCount}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                <Text style={{fontSize:10}}><Icon name="md-radio" size={12}/>&nbsp;&nbsp;{item.recordCount}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ref={(ref) => { this.flatList = ref; }}
                    onRefreshing={() => new Promise((r) => {
                        setTimeout(() => {
                            fetch(`${WEBSITEURL}/circleList.php?id=0`)
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
                            fetch(`${WEBSITEURL}/circleList.php?id=${no}`)
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