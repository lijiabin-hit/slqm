/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
// // import detail from './app/component/detail'
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   WebView,
//   Navigator,
// } from 'react-native';
// import { createStackNavigator } from 'react-navigation';
//
// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });
//
// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//             <View style={styles.container}>
//               {/*<Text>asfljasl</Text>*/}
//
//               <WebView
//                   automaticallyAdjustContentInsets={true}
//                   source={require('./www/index.html')}
//                   style={{width:360}}
//                   onMessage={()=>this.gotodetail()}
//               >
//
//               </WebView>
//             </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

import React, { Component } from 'react';
import ContentComponent from './app/component/content'
import IndexComponent from './app/component/index'
import TestComponent from './app/component/test'
import DetailTest from './app/component/detailTest'
import DetailComponent from './app/component/detail'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView,
} from 'react-native';
// import { Button, Image, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json
import LoginComponent from "./app/component/login"
import RegComponent from "./app/component/register"
import PersonalComponent from "./app/component/personal"
import ShareList from "./app/component/sharelist"
import MyCollection from "./app/component/myCollection"
import MyShareList from "./app/component/myShareList"
import MyCommentList from "./app/component/myCommentList"
import MyCircleList from "./app/component/myCircleList"
import MyRecordList from "./app/component/myRecordList"
import RecordList from "./app/component/RecordList"
import CircleList from "./app/component/CircleList"
import CircleDetail from "./app/component/circleDetail"
import CircleContent from "./app/component/circleContent"
import ShareDetail from "./app/component/shareDetail"
import ShareCommentList from "./app/component/ShareCommentList"
import RecordCommentList from "./app/component/RecordCommentList"
import RecordDetail from "./app/component/recordDetail"
import PostCircle from "./app/component/postCircle"
import PostShare from "./app/component/postShare"
import PostCircleContent from "./app/component/postCircleContent"
import PostRecord from "./app/component/postRecord"
import ShareSearch from "./app/component/shareSearch"
import RecordSearch from "./app/component/recordSearch"
import CircleSearch from "./app/component/circleSearch"
import VideoList from "./app/component/videoList"
import VideoDetail from "./app/component/videoDetail"

const MainStack = StackNavigator(
    {
        Content: {
        screen: ContentComponent,
        },
        Test:{
            screen:TestComponent,
        },
        DetailTest:{
            screen:DetailTest,
        },
        Detail:{
            screen:DetailComponent,
        },
        VideoList:{
            screen:VideoList
        },
        VideoDetail:{
            screen:VideoDetail
        }
    },
    {
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#d7a55c',
                height:40,
                /*textAlign:'center',*/
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);
const Users = StackNavigator(
    {
        Personal:{
            screen:PersonalComponent,
        },
        Login:{
            screen:LoginComponent,
        },
        Register:{
            screen:RegComponent,
        },
        ShareList:{
            screen:ShareList,
        },
        MyCollection:{
            screen:MyCollection,
        },
        MyShareList:{
            screen:MyShareList,
        },
        MyCommentList:{
            screen:MyCommentList,
        },
        MyCircleList:{
            screen:MyCircleList,
        },
        MyRecordList:{
            screen:MyRecordList,
        },
        RecordList:{
            screen:RecordList,
        },
        CircleList:{
            screen:CircleList,
        },
        CircleDetail:{
            screen:CircleDetail,
        },
        CircleContent:{
            screen:CircleContent,
        },
        ShareDetail:{
            screen:ShareDetail,
        },
        ShareCommentList:{
            screen:ShareCommentList,
        },
        RecordCommentList:{
            screen:RecordCommentList,
        },
        RecordDetail:{
            screen:RecordDetail,
        },
        MyCommentList:{
            screen:MyCommentList,
        },
        PostCircle:{
            screen:PostCircle
        },
        PostShare:{
            screen:PostShare
        },
        PostCircleContent:{
            screen:PostCircleContent
        },
        PostRecord:{
            screen:PostRecord
        },
        ShareSearch:{
            screen:ShareSearch
        },
        RecordSearch:{
            screen:RecordSearch
        },
        CircleSearch:{
            screen:CircleSearch
        }
    },
    {
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#d7a55c',
                height:40,
                /*textAlign:'center',*/
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);
const RootStack = StackNavigator(
    {
        MyModal: {
            screen: IndexComponent,
        },
        Main: {
            screen: MainStack,
        },
        Users: {
            screen: Users,
        },



    },
    {
      mode: 'modal',
      headerMode: 'none',
    }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
