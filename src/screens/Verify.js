import React, {useContext} from 'react';
import styled from 'styled-components';
import { Button, Image } from '../components';
import { auth } from '../firebase';
import { sendEmailVerification } from "firebase/auth";
import {Alert} from 'react-native';
import {UserContext} from '../contexts';


//logo img url
const LOGO='https://imgur.com/WlBv9GC.png';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0px 30px;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 30px;
  padding: 10px;
  font-weight: bold;
  color: ${({theme}) => theme.greenText};
`;



const Verify = ({navigation}) => {

  // user 정보 업데이트 위해 불러옴
  const {setUser} = useContext(UserContext);
  
  //인증 메일 전송 
  const sendEmail = () => {
    sendEmailVerification(auth.currentUser);
    Alert.alert("인증 메일을 전송했습니다.");
  };

  //인증 여부 확인
  const isVerify = () => {
    auth.currentUser.reload();
    if(auth.currentUser.emailVerified) {
      Alert.alert("인증되었습니다.");
      setUser(auth.currentUser);
    }
    else{
      Alert.alert("미인증 상태입니다. 인증 링크를 클릭하셨다면 버튼을 다시 한 번 눌러주세요.");
    }
  };

  

  return (
    <Container>
      {/* 로고 이미지 */}
      <Image 
      url={LOGO}
      containerStyle={{
        width: 120,
        height: 120,
        marginBottom:30,
      }}/>
      <StyledText>회원가입 신청 완료!</StyledText>
      <StyledText
      style={{
        fontSize: 18,
        lineHeight: 30,
      }}>{
        `❕'이메일 전송' 버튼을 누르면 메일로
      인증 링크가 전송됩니다.
❕링크를 클릭한 뒤 '인증 완료' 버튼을 
      누르면 인증이 완료됩니다.`
      }</StyledText>
      <Button 
      title='이메일 전송' 
      onPress={sendEmail}
      containerStyle={{
        padding: 15,
        marginTop: 0,
        marginBottom: 25,
        borderRadius: 30,
      }}
      textStyle={{
        fontSize: 20,
        fontWeight: '600',
      }}
      />
      <Button 
      title='인증 완료' 
      onPress={isVerify}
      containerStyle={{
        padding: 15,
        marginTop: 0,
        marginBottom: 25,
        borderRadius: 30,
      }}
      textStyle={{
        fontSize: 20,
        fontWeight: '600',
      }}
      />
    </Container>
  );
}

export default Verify;