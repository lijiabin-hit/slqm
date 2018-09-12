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
import Icon from 'react-native-vector-icons/Ionicons';
export default class LogoLeft extends React.Component{
    render(){
        return(
            <Text>&nbsp;<Icon name="ios-arrow-back" size={15} color="black"/><Icon name="ios-arrow-back" size={15} color="black"/>返回</Text>
        )
    }
}