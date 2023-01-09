
import {Alert, View} from 'react-native';
import React, {useContext, useState, useRef, useEffect} from 'react';
import styled, { ThemeContext } from 'styled-components';
import {Button, ErrorMsg, Input, Image} from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validateEmail, removeWhitespace} from '../util';
import {UserContext, ProgressContext} from '../contexts';

import { auth } from '../firebase';

import {
  signInWithEmailAndPassword,
} from 'firebase/auth';


//logo img url
const LOGO='https://imgur.com/fHvi2d3.png';


//styled-components
const Container = styled.View`
  flex : 1;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 30px;
  padding-top: ${({ insets: {top} })=> top}px;
  padding-bottom: ${({ insets: {bottom }})=> bottom}px;
`;

const StyledText = styled.Text`
  font-size: 24px;
  color: black;
`;




const Login = ({navigation})=> {
  const insets = useSafeAreaInsets();
  const theme=useContext(ThemeContext);
  const refPw=useRef(null);

  // user 정보 업데이트 위해 불러옴
  const {setUser} = useContext(UserContext);
  
  
  const {spinner} = useContext(ProgressContext);

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [disabled, setDisabled] = useState(true);


  //로그인 버튼 활성화 설정
  useEffect(() => {
    setDisabled(!(email && pw && !errorMsg));
  }, [email, pw, errorMsg]);


  //이메일 입력 
  const _handleEmailChange = email => {
    //공백 없애고 업데이트
    const changedEmail=removeWhitespace(email);
    setEmail(changedEmail);
    //유효성 검사 후 에러 메시지 변경
    setErrorMsg(validateEmail(changedEmail) ? '' : '올바른 이화인 이메일을 입력해주세요');
  }

  //패스워드 입력
  const _handlePwChange = pw => {
    //공백 없애고 업데이트
    setPw(removeWhitespace(pw));
    setErrorMsg(pw ? '' : '비밀번호를 입력해주세요');
  }

  //로그인 버튼 함수
  const _handleSigninBtnPress = async () => {
    
    // 로그인 성공
    try{
      //spinner 실행
      spinner.start();

      //Signin 함수
      const userInfo = await signInWithEmailAndPassword(auth, email, pw);
      
      
      //user 업데이트
      setUser(userInfo.user);
      
      
      setEmail('');
      setPw('');

      // 미인증인 경우
      if (!auth.currentUser.emailVerified) {
        navigation.navigate('NotVerified');
      }
    }
    // 로그인 실패
    catch(err){
      console.log(err.message);
      Alert.alert("로그인 실패"); 
    }
    finally{
      // spinner 중지
      spinner.stop();
    }
  }

  return (
    <KeyboardAwareScrollView 
    extraScrollHeight={20}
    contentContainerStyle={{flex: 1}}> 
    <Container insets={insets}>

      {/* 로고 이미지 */}
      <Image 
      url={LOGO}
      containerStyle={{
        width: 150,
        height: 150,
        marginVertical: 30,
      }}/>

      {/* 이메일 Input */}
      <Input
      placeholder='이메일'
      returnKeyType='next'
      value={email}
      onChangeText={_handleEmailChange} 
      onSubmitEditing={()=> refPw.current.focus()}
      />

      {/* 패스워드 Input */}
      <Input
      ref={refPw}
      placeholder='비밀번호'
      returnKeyType='done'
      value={pw}
      onChangeText={_handlePwChange}
      isPassword={true}
      onSubmitEditing={_handleSigninBtnPress}
      />

      {/* 에러 메시지 */}
      <ErrorMsg msg={errorMsg}/>
      <View style={{height: 10}}></View>

      {/* 로그인 버튼 */}
      <Button 
      title="로그인" 
      onPress={_handleSigninBtnPress}
      disabled={disabled}
      />

      {/* 회원가입 버튼 */}
      <Button 
      title="이메일로 회원가입하기" 
      onPress={()=> navigation.navigate('SignUp')}
      containerStyle={{
        marginBottom: 30,
        backgroundColor: 'transparent', 
      }}
      textStyle={{
        color: theme.d_btnBgColor,
        fontSize: 18,
        fontWeight: '600',
      }}
      />
      {/* 비밀번호 찾기 버튼 */}
      <Button 
      title="비밀번호를 잊으셨나요?" 
      onPress={()=> navigation.navigate('FindPw')}
      containerStyle={{
        marginTop: 15,
        backgroundColor: 'transparent', 
      }}
      textStyle={{
        color: theme.l_btnTextLink,
        fontSize: 16,
        fontWeight: '500',
        textDecorationLine:'underline',
      }}
      />
    </Container>
    </KeyboardAwareScrollView>
  );
} 


export default Login;