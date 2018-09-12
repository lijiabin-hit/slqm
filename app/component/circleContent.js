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
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import LogoTitle from "./logoTitle"
import LogoLeft from "./logoLeft"
import WEBSITEURL from "../variable/websitURL"
import RefreshableFlatList from 'react-native-refreshable-flatlist';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {SlidingPane, SlidingPaneWrapper} from 'react-native-sliding-panes';

const { width } = Dimensions.get('window');
export default class CircleContent extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        data1: new Array(),
        loadingVisible1:true,
        loadedState1:false,
        data2: new Array(),
        loadingVisible2:true,
        loadedState2:false,
        isWhere:1,
    }
    componentDidMount=function(){
        this.setupSlidingPanes();
        console.log(`${WEBSITEURL}/shareList.php?id=0`)
        console.log(`${WEBSITEURL}/recordList.php?id=0`)
        fetch(`${WEBSITEURL}/shareList.php?id=0&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({data1:responseJson,loadingVisible1:false});
                console.log(this.state.data1)
            })
            .catch((error)=>{
                console.log(123+error)
            })
        fetch(`${WEBSITEURL}/recordList.php?id=0&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
            .then((response)=>response.json())
            .then((responseJson)=>{
                this.setState({data2:responseJson,loadingVisible2:false});
                console.log(this.state.data2)
            })
            .catch((error)=>{
                console.log(123+error)
            })
    }
    setupSlidingPanes() {
        this.pane1.warpCenter();
        this.pane2.warpRight();
        this.slidingPaneWrapper.childPanes = [this.pane1, this.pane2];
    }
    static navigationOptions =({ navigation, navigationOptions }) =>{
        return {
            headerTitle: (<LogoTitle title={navigation.getParam("title")}/>),
            headerLeft: (
                <TouchableOpacity onPress={()=>navigation.goBack()}><LogoLeft/></TouchableOpacity>
                // <Text>&lt;&lt;返回</Text>
            ),
            headerRight: (
                // <Text><TouchableOpacity></TouchableOpacity><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('PostCircleContent',{cID:navigation.getParam("cID"),title:navigation.getParam("title")})}><Text><Icon name="md-add" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text></TouchableOpacity>


            ),
        }
    }
    render() {
        const swipe_config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        let navLinkClicked = (text) => {
            switch (text) {
                case '分  享':
                    this.setState({isWhere:1});
                    this.slidingPaneWrapper.setActive(0);
                    break;
                case '录  音':
                    this.setState({isWhere:2});
                    this.slidingPaneWrapper.setActive(1);
                    break;
            }
        };

        const onSwipe = (gestureName, gestureState) => {
            const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
            switch (gestureName) {
                case SWIPE_LEFT:
                    this.setState({isWhere:2});
                    this.slidingPaneWrapper.slideAllLeft();
                    break;
                case SWIPE_RIGHT:
                    this.setState({isWhere:1});
                    this.slidingPaneWrapper.slideAllRight();
                    break;
                default:
                    break;
            }
        };

        let renderNavBarButton = (text, additional_styles,textStyle) => {
            return  <TouchableOpacity style={ [styles.navLink, additional_styles] }
                                      onPress={() => {navLinkClicked(text)}}>
                <View style={ { flexDirection: 'row' } }>
                    <Text style={[styles.navLinkText,textStyle]}>{text}</Text>
                </View>
            </TouchableOpacity>
        };
        return (
            <View style={styles.container}>
                <GestureRecognizer
                    onSwipe={(direction, state) => onSwipe(direction, state)}
                    config={swipe_config}>
                    <View style={{ width: '100%' }}>
                        <View style={styles.navBarBuffer} />
                        <View style={styles.navBar}>
                            { this.state.isWhere==1?renderNavBarButton('分  享', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"#d7a55c"}):renderNavBarButton('分  享', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"white"}) }
                            { this.state.isWhere==2?renderNavBarButton('录  音', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"#d7a55c"}):renderNavBarButton('录  音', { borderRightColor: '#CCCCCC', borderRightWidth: 1 },{color:"white"}) }
                        </View>
                    </View>
                    <SlidingPaneWrapper style={{}} ref={(slidingPaneWrapper) => { this.slidingPaneWrapper = slidingPaneWrapper }}>
                        <SlidingPane style={[{borderColor: '#d7a55c', borderWidth: 2}]}
                                     ref={ (pane1) => { this.pane1 = pane1} }>
                            <View style={styles.container1}>
                                <RefreshableFlatList
                                    topIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><ActivityIndicator color="#0000ff" /></View>}
                                    bottomIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><Text>{this.state.loadedState1?"已经到底了！":"加载中..."}</Text></View>}
                                    data={this.state.data1}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity  onPress={()=>this.props.navigation.navigate("ShareDetail",{sID:item.id,title:item.title})} key={item.id} style={styles.Item}>
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
                                            fetch(`${WEBSITEURL}/shareList.php?id=0&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
                                                .then((response)=>response.json())
                                                .then((responseJson)=>{
                                                    this.setState({data1:responseJson});
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
                                            const no = this.state.data1.length;
                                            fetch(`${WEBSITEURL}/shareList.php?id=${no}&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
                                                .then((response)=>response.json())
                                                .then((responseJson)=>{
                                                    responseJson.length==0?this.setState({loadedState1:true}):this.setState({ data1: this.state.data1.concat(responseJson) });
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
                                    visible={this.state.loadingVisible1}
                                    color="white"
                                    indicatorSize="large"
                                    messageFontSize={24}
                                    message="Loading..."
                                />
                            </View>
                        </SlidingPane>
                        <SlidingPane style={[{borderColor: '#d7a55c', borderWidth: 2}]}
                                     ref={ (pane2) => { this.pane2 = pane2} }>
                            <View style={styles.container1}>
                                <RefreshableFlatList
                                    topIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><ActivityIndicator color="#0000ff" /></View>}
                                    bottomIndicatorComponent={<View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}><Text>{this.state.loadedState2?"已经到底了！":"加载中..."}</Text></View>}
                                    data={this.state.data2}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity  onPress={()=>this.props.navigation.navigate("RecordDetail",{rID:item.id,title:item.title})} key={item.id} style={styles.Item}>
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
                                            fetch(`${WEBSITEURL}/recordList.php?id=0&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
                                                .then((response)=>response.json())
                                                .then((responseJson)=>{
                                                    this.setState({data2:responseJson});
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
                                            const no = this.state.data2.length;
                                            console.log()
                                            fetch(`${WEBSITEURL}/recordList.php?id=${no}&cID=${JSON.stringify(this.props.navigation.getParam('cID',"1"))}`)
                                                .then((response)=>response.json())
                                                .then((responseJson)=>{
                                                    responseJson.length==0?this.setState({loadedState2:true}):this.setState({ data2: this.state.data2.concat(responseJson) });
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
                                    visible={this.state.loadingVisible2}
                                    color="white"
                                    indicatorSize="large"
                                    messageFontSize={24}
                                    message="Loading..."
                                />
                            </View>
                        </SlidingPane>
                    </SlidingPaneWrapper>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#ded2c2',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8ECC2'
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
    navBarBuffer: {
    },
    navBar: {
        height: 35,
        backgroundColor: '#ded2c2',
        width: '100%',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 1,
        borderTopColor: '#DDDDDD',
        borderTopWidth: 1,
        flexDirection: 'row'
    },
    navLink: {
        flex: 1,
        alignItems: 'center'
    },
    navLinkText: {
        paddingTop: 10,
        paddingBottom: 10
    },
    paneText: {
        fontSize: 22
    }
});