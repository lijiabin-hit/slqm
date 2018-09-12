/**
 * Created by lijiabin on 2018/5/20.
 */
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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import RefreshableFlatList from 'react-native-refreshable-flatlist';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

const { width } = Dimensions.get('window');
export default class ShareCommentList extends Component {
    state = {
        data: new Array(),
        loadingVisible:true,
        loadedState:false,
    }
    componentDidMount=function(){
        console.log(`${WEBSITEURL}/ShareCommentList.php?id=0&sID=${this.props.navigation.getParam("sID")}`)
        fetch(`${WEBSITEURL}/ShareCommentList.php?id=0&sID=${this.props.navigation.getParam("sID")}`)
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
            headerTitle: (<LogoTitle title="全部评论"/>),
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
    render() {
        console.log(this.state.data);
        return (
            <View style={styles.container}>
                <RefreshableFlatList
                    topIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><ActivityIndicator color="#0000ff" /></View>}
                    bottomIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><Text>{this.state.loadedState?"已经到底了！":"加载中..."}</Text></View>}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <View key={item.id} style={styles.Item}>
                            <View style={styles.ItemAuthor}>
                                <Image style={styles.NextImage} source={{uri:`${WEBSITEURL}/img/${item.authorImg}`}}></Image>
                                <Text style={{fontSize:10}}>{item.authorLogin}</Text>
                            </View>
                            <Text style={{fontSize:16}}>{item.content}</Text>
                            <Text style={{fontSize:10,marginTop:5, marginBottom:10,}}>{item.date}&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                        </View>
                    )}
                    ref={(ref) => { this.flatList = ref; }}
                    onRefreshing={() => new Promise((r) => {
                        setTimeout(() => {
                            fetch(`${WEBSITEURL}/ShareCommentList.php?id=0&sID=${this.props.navigation.getParam("sID")}`)
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
                            fetch(`${WEBSITEURL}/ShareCommentList.php?id=${no}&sID=${this.props.navigation.getParam("sID")}`)
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
        backgroundColor:"#dade9f",
        borderBottomWidth:1,
        borderBottomColor:"#A7A7A7",
        alignItems:"flex-start",
        justifyContent:"space-around",
        paddingLeft:10,
        paddingRight:10,
    },
    ItemAuthor:{
        marginTop:10,
        marginBottom:5,
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