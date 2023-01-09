import React, {useState, useEffect, useContext} from 'react';
import styled, { ThemeContext } from 'styled-components';
import {Button, Input, ErrorMsg} from '../components';
import { Alert, View } from 'react-native';
import {validateEmail, removeWhitespace} from '../util';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import {ProgressContext} from '../contexts';

const Container = styled.View`
  flex : 1;
  background-color: white;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  margin-top: 40px;
`;

const StyledText = styled.Text`
  text-align: left;
  font-size: 17px;
  font-weight: bold;
  color: ${ ({theme}) => theme.greenText};
  margin: 10px 0;
`;

const FindPw = ({navigation})=> {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const {spinner} = useContext(ProgressContext);

  //버튼 활성화
  useEffect(() => {
    setDisabled(!(email && !errorMsg));
  }, [email, errorMsg]);

  
  const theme=useContext(ThemeContext);


  //이메일 입력 
  const _handleEmailChange = email => {
    //공백 없애고 업데이트
    const changedEmail=removeWhitespace(email);
    setEmail(changedEmail);
    //유효성 검사 - 에러 메시지 변경
    setErrorMsg(validateEmail(changedEmail) ? '' : '올바른 이화인 이메일을 입력해주세요');
  }


  //메일 전송 버튼 함수
  const sendEmail = async () => {
    
    // 전송 성공
    try{
      //spinner 실행
      spinner.start();

      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "인증 메일 전송 완료!",
        "메일함을 확인하여 비밀번호를 재설정하세요",
        [
          {
            text: "취소",
            onPress: () => {},
            style: "cancel"
          },
          { text: "확인", onPress: () => navigation.navigate('Login') }
        ],
      );

      setEmail('');
    }

    // 메일 전송 실패
    catch(e){
      switch(e.code) {
        case 'auth/invalid-email':
          Alert.alert('올바른 이메일을 입력해주세요');
          break;
        case 'auth/user-not-found':
          Alert.alert('존재하지 않는 계정입니다');
          break;
        default:
          Alert.alert("메일 전송 실패"); 
      }
    }
    finally{
      // spinner 중지
      spinner.stop();
    }
  }

  return (
    <Container>
      <StyledText>비밀번호를 재설정할 이메일을 입력해주세요</StyledText>

      <Input
      placeholder='이메일'
      returnKeyType='done'
      value={email}
      onChangeText={_handleEmailChange} 
      onSubmitEditing={()=>{}}
      />

      {/* 에러 메시지 */}
      <ErrorMsg msg={errorMsg}/>
      <View style={{height: 10}}></View>

      <Button 
      title="인증 메일 전송" 
      onPress={sendEmail}
      disabled={disabled}
      />
    </Container>
  );
} 

export default FindPw;