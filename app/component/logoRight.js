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
export default class LogoRight extends React.Component{
    render(){
        return(
            <Text><Icon name="md-person" size={23} color="white"/>&nbsp;&nbsp;&nbsp;&nbsp;</Text>
        )
    }
}