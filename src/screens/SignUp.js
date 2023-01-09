import React, {useState, useRef, useEffect, useContext} from 'react';
import styled, { ThemeContext } from 'styled-components';
import {Button, Input, ErrorMsg} from '../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {validateEmail, removeWhitespace} from '../util';
import {ProgressContext} from '../contexts';
import {auth, createUser, getCurUser} from '../firebase';

import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';


//styled components
const Container = styled.View`
  flex : 1;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 30px;
`;

const RowContainer = styled.View`
  width: 90%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  margin: 3px 0;
`;

const StyledText = styled.Text`
  font-size: 17px;
  color: ${({ theme })=> theme.greenText};
  width:100px;
  margin-right: 10px;
  font-weight: bold;
`;


const SignUp = ({navigation})=>{


  const theme=useContext(ThemeContext);
  
  const refPw=useRef(null);
  const refPwCheck=useRef(null);
  const refDidMount = useRef(null);
  
  const {spinner} = useContext(ProgressContext);


  //상태 변수
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [disabled, setDisabled] = useState(true);


  //버튼 활성화 여부 설정
  useEffect(() => {
    setDisabled(!(email && pw && pwCheck && !errorMsg));
  }, [email, pw, pwCheck, errorMsg]);


  //에러 메시지 변경
  useEffect(() => {
    if(refDidMount.current){
      let error = '';
      if(!email) {error = '이메일을 입력해주세요';}
      else if(!validateEmail(email)) {error='올바른 이화인 이메일을 입력해주세요';}
      else if(pw.length<6) {error = '비밀번호를 6자 이상 입력해주세요';}
      else if(pw!==pwCheck) {error = '비밀번호를 확인해주세요';}
      else {error='';}
      setErrorMsg(error);
    }
    else{
      refDidMount.current =true;
    }
  }, [email, pw, pwCheck]);



  //회원가입하는 함수
  const _handleSignupBtnPress = async () => {
    
    //회원가입 성공
    try{
      //spinner 실행
      spinner.start();
  
      //Signup 함수
      const newUser = await createUserWithEmailAndPassword(auth, email, pw);
      

      // user 불러오기
      const curUser=getCurUser();

      // DB - users에 저장
      await createUser({
        uid: curUser.uid, 
      });

      setEmail('');
      setPw('');
      setPwCheck('');

      navigation.navigate('Verify');
    }

    // 회원가입 실패
    catch(err){
      switch (err.code) {
        case 'auth/email-already-in-use':
          Alert.alert('이미 가입한 이메일입니다');
          break;
        default:
          console.log(err.message);
          Alert.alert("회원가입 실패");
      }
    }
    finally{
      //spinner 중지
      spinner.stop();
    }
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
    <Container>

      {/* 이메일 */}
      <RowContainer>
        <StyledText>이화인 이메일</StyledText>
        {/* 이메일 입력칸 */}
        <Input
        style={{flex:1}}
        placeholder='이화인 이메일'
        returnKeyType='next'
        value={email}
        onChangeText={setEmail} 
        onSubmitEditing={()=> refPw.current.focus()}
        onBlur={()=> setEmail(removeWhitespace(email))}
        />
      </RowContainer>

      {/* 패스워드 */}
      <RowContainer>
        <StyledText>비밀번호</StyledText>
        {/* 패스워드 입력칸 */}
        <Input
        ref={refPw}
        label='비밀번호 입력'
        placeholder='비밀번호'
        returnKeyType='next'
        value={pw}
        onChangeText={setPw}
        isPassword={true}
        onSubmitEditing={()=> refPwCheck.current.focus()}
        onBlur={()=> setPw(removeWhitespace(pw))}
        />
      </RowContainer>

      {/* 패스워드 확인 */}
      <RowContainer>
        <StyledText>비밀번호 확인</StyledText>
        {/* 패스워드 확인 입력칸 */}
        <Input
        ref={refPwCheck}
        label='비밀번호 확인'
        placeholder='비밀번호 확인'
        returnKeyType='done'
        value={pwCheck}
        onChangeText={setPwCheck}
        isPassword={true}
        onSubmitEditing={()=>_handleSignupBtnPress}
        onBlur={()=> setPwCheck(removeWhitespace(pwCheck))}
        />
      </RowContainer>

      {/* 에러 메시지 */}
      <ErrorMsg msg={errorMsg}/>
      {/* 회원가입 버튼 */}
      <Button 
      title="회원가입" 
      onPress={_handleSignupBtnPress}
      disabled={disabled}
      containerStyle={{
        marginTop: 15,
      }}
      />
    </Container>
    </KeyboardAwareScrollView>
  );  
}

export default SignUp;

