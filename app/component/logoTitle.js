/**
 * Created by lijiabin on 2018/5/6.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
export default class LogoTitle extends React.Component {
    render() {
        return (
            <View style={{flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flex:1}}><Text style={{textAlign: 'center',}}>{this.props.title}</Text></View>
            </View>
            // <Text style={{textAlign:"center"}}>一东</Text>
        );
    }
}