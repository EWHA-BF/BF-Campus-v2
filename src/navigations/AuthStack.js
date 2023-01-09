import React, {useContext} from 'react';
import { ThemeContext } from 'styled-components';
import { TouchableOpacity, Text } from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import {SignUp, Login, FindPw, Verify, NotVerified} from '../screens'; 
import {Home} from '../screens'; 

const Stack = createStackNavigator();

//로그인 No 화면
const AuthStack = ()=> {
  const theme=useContext(ThemeContext);

  return (
  <Stack.Navigator 
  initialRouteName='Login'
  screenOptions={{
    //header 설정
    headerTintColor: theme.headerTitle,
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    headerShadowVisible: true,
    headerTitleAlign: 'center',
    headerBackTitleVisible: false,
    headerLeft: ({onPress}) => (
      <TouchableOpacity 
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <Ionicons 
        name="chevron-back-outline" 
        size={28}
        style={{
          marginHorizontal:5, 
          color: theme.headerTitle,
        }}
        /> 
      <Text style={{
        fontSize: 16, 
        alignSelf: 'center',
        color: theme.headerTitle,
      }}>뒤로 가기</Text>
      </TouchableOpacity>
    ),
  }}>
    
    {/* 화면 1 */}
    <Stack.Screen 
    name="Login" 
    component={Login}
    options={{
      headerShown: false,
    }}
    />
    {/* 화면 2 */}
    <Stack.Screen 
    name="SignUp" 
    component={SignUp}
    options={{
      headerTitle: '회원가입',
    }}/>
    {/* 화면 3 */}
    <Stack.Screen 
    name="FindPw" 
    component={FindPw}
    options={{
      headerTitle: '비밀번호 재설정',
    }}/>
    {/* 화면 4 */}
    <Stack.Screen 
    name="Verify" 
    component={Verify}
    options={{
      headerTitle: '이화인 메일 인증',
    }}/>
    {/* 화면 5 */}
    <Stack.Screen 
    name="NotVerified" 
    component={NotVerified}
    options={{
      headerTitle: '이화인 메일 인증',
    }}/>
    {/* 화면 6 */}
    <Stack.Screen 
    name="Home" 
    component={Home}
    options={{
      headerShown: false,
    }}
    /> 
  </Stack.Navigator>
  );
} 

export default AuthStack;