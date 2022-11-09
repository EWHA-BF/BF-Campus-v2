import React, {useContext} from 'react';
import { ThemeContext } from 'styled-components';
import {createStackNavigator} from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import {Walkthrough, SignUp, Login, FindPw, Verify, NotVerified} from '../screens'; 
import {Home} from '../screens'; 
import MainDrawer from './MainDrawer'; 

const Stack = createStackNavigator();

//로그인 No 화면
const AuthStack = ()=> {
  //const theme=useContext(ThemeContext);
  return (
  <Stack.Navigator 
  initialRouteName='Walkthrough'
  screenOptions={{
    //배경색 지정
    cardStyle: {
      //backgroundColor: theme.bgColor
      backgroundColor: 'white'
    },
    //header 설정
    headerStyle: {
    },
    headerTitleStyle: {
      fontSize: 18,
    },
    headerTintColor: 'black',
    headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerLeft: ({onPress, tintColor}) => {
        return (
          <Ionicons 
          name="chevron-back-outline" 
          size={30}
          style={{marginLeft:5,}}
          color={tintColor}
          onPress={onPress}/> 
        );
      }
  }}>
    {/* 화면 1 */}
    <Stack.Screen 
    name="Walkthrough" 
    component={Walkthrough}
    options={{
      headerShown: false,
    }}
    />
    {/* 화면 2 */}
    <Stack.Screen 
    name="Login" 
    component={Login}
    options={{
      headerShown: false,
    }}
    />
    {/* 화면 3 */}
    <Stack.Screen 
    name="SignUp" 
    component={SignUp}
    options={{
      headerTitle: '회원가입',
    }}/>
    {/* 화면 4 */}
    <Stack.Screen 
    name="FindPw" 
    component={FindPw}
    options={{
      headerTitle: '비밀번호 재설정',
    }}/>
    {/* 화면 5 */}
    <Stack.Screen 
    name="Verify" 
    component={Verify}
    options={{
      headerTitle: '이화인 메일 인증',
    }}/>
    {/* 화면 6 */}
    <Stack.Screen 
    name="NotVerified" 
    component={NotVerified}
    options={{
      headerTitle: '이화인 메일 인증',
    }}/>
    {/* 화면 7 */}
    {/* <Stack.Screen 
    name="MainDrawer" 
    component={MainDrawer}
    options={{
      headerShown: false,
    }}
    />  */}
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