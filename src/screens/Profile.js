import {Button} from '../components';
import {UserContext} from '../contexts';
import {Alert, View, TextInput} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styled, { ThemeContext } from 'styled-components';
import {auth, getCurUser, DB} from '../firebase';
import {signOut, deleteUser} from 'firebase/auth';
import { doc, getDoc, deleteDoc,  } from "firebase/firestore";


const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
  background-color: white;
  padding: 30px;
  padding-top: 50px;
`;

const BtnContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 50px;
`

const RowContainer = styled.View`
  width: 90%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  marginVertical: 15px;
`;

const StyledText = styled.Text`
  font-size: 22px;
  color: ${({ theme })=> theme.greenText};
  width:auto;
  margin-bottom: 10px;
  font-weight: bold;
`;


export default function Profile({navigation}) {


  const theme=useContext(ThemeContext);

  // 포인트 상태 변수
  const [userPoint, setUserPoint] = useState('0');

  // user 정보 업데이트 위해 불러옴
  const {setUser} = useContext(UserContext);

  //현재 로그인한 사용자 정보 받아오기
  const curUser=getCurUser();

  // 로그아웃 함수
  const signout= async ()=> {
    await signOut(auth);
  }

  // 회원탈퇴 함수
  const deleteuser= async ()=> {
    // auth user 삭제
    await deleteUser(auth.currentUser);
    // db에서 user 삭제
    await deleteDoc(doc(DB, 'users', `${curUser.uid}`));
  }

  // 사용자 point 가져오기
  useEffect(()=>{
    const getPoint = async ()=> {
      // users - 해당 uid 문서 읽기
      const docRef = doc(DB, 'users', `${curUser.uid}`);
      const docSnap=await getDoc(docRef);
      const data = docSnap.data();
      if(data.point) {
        setUserPoint(data.point);
      }
    };
    getPoint();
  }, []);


  return (
    <Container>
      {/* 이메일 */}
      <RowContainer>
        <StyledText>이화인 이메일</StyledText>
        {/* 이메일 표시 input*/}
        <View
        style={{
          width: '100%',
          marginTop: 10
        }}
        >
          <TextInput
          disabled={true}
          style={{
            backgroundColor: 'white',
            padding: 12,
            fontSize: 19,
            borderColor: theme.l_greenText,
            borderRadius: 10,
            borderWidth: 1,
          }}
          placeholder={curUser.email}
          placeholderTextColor={theme.inputPlaceholder}
        />
        </View>
      </RowContainer>

      {/* 포인트 */}
      <RowContainer>
        <StyledText>포인트</StyledText>
        {/* 포인트 표시 */}
        <StyledText
        style={{
          fontSize: 28,
          color: theme.l_greenText,
          fontWeight: 'bold',
          marginTop: 5,
        }}
        >{userPoint} point</StyledText>
      </RowContainer>

      <BtnContainer>
      {/* 비밀번호 재설정 버튼 */}
      <Button 
      title="비밀번호 재설정" 
      onPress={ () => {
        navigation.navigate('FindPw');
      }}
      containerStyle={{
        borderRadius: 13
      }}
      />

      {/* 로그아웃 버튼 */}
      <Button 
      title="로그아웃" 
      // 로그아웃하고 user 업데이트
      onPress={ async () => {
        try{
          await signout();
        }
        catch(e){
          console.log(e.message);
          Alert.alert("로그아웃 실패"); 
        }
        finally{
          setUser({});
        }
      }}
      containerStyle={{
        marginTop: 15,
        borderRadius: 13
      }}
      />

      {/* 회원탈퇴 버튼 */}
      <Button 
      title="회원 탈퇴" 
      // 로그아웃하고 user 업데이트
      onPress={ async () => {
        Alert.alert(
          "회원 탈퇴",
          "정말로 탈퇴하시겠습니까?",
          [
            {
              text: "취소",
              onPress: () => {},
              style: "cancel"
            },
            { text: "탈퇴", onPress: async () => {
                try{
                  await deleteuser();
                }
                catch(e){
                  console.log(e.message);
                  Alert.alert("회원 탈퇴 실패"); 
                }
                finally{
                  setUser({});
                }
            }}
          ],
        );  
        
      }}
      containerStyle={{
        marginTop: 20,
        backgroundColor: 'transparent', 
      }}
      textStyle={{
        color: theme.l_btnTextLink,
        fontSize: 18,
        fontWeight: '500',
        textDecorationLine:'underline',
      }}
      />

</BtnContainer>

</Container>
  );
}
