import React, { useState, useEffect, useRef, useLayoutEffect, useContext  } from 'react';
import styled from 'styled-components';
import {Text,  View} from 'react-native';
import {createPost, getCurUser} from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage, DB} from "../firebase";
import { doc,updateDoc  } from "firebase/firestore";
import { ThemeContext } from 'styled-components';
import { TouchableOpacity, Alert} from 'react-native';
import {ProgressContext} from '../contexts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  padding: 10px 40px;
`;

const StyledText = styled.Text`
  font-size: 18px;
  color: ${ ({theme}) => theme.d_btnBgColor};
  font-weight: bold;
  background-color: transparent;
  padding-vertical: 20px;
`;




//기간 설정 화면
export default function SetDay({navigation, route}) {

  const [disabled, setDisabled] = useState(true);
  
  // -- DateTimePickerModal --
  const DateFormat = "YYYY/MM/DD";
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // 0-hide , 1-startdate, 2-end date
  const [dateVisible, setDateVisibleState] = useState(0);
  const dateVisibleRef = useRef(0);

  const setDateVisible = (val) => {
    dateVisibleRef.current = val;
    setDateVisibleState(val);
  }

  const [calendarDate, setCalendarDate] = useState(new Date());
  //----


  const theme=useContext(ThemeContext);
  const {spinner} = useContext(ProgressContext);


  // storage에 이미지 올리기
  const uploadImage = async (image_uri, postId)=> {

    const response = await fetch(image_uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `post/${postId}/photo.jpg`);

    uploadBytes(storageRef, blob).then((snapshot) => {
    
    // storage에서 img 값 불러오기
    getDownloadURL(storageRef)
    .then((url) => {
      const curDocRef = doc(DB, "boards", `${route.params.boardId}/posts/${postId}`);
      updateDoc(curDocRef, {
        image: url,
      });
    })  
    .catch((error) => {
      console.log(error.message);
    });
    
  });
}

//글 업로드 함수
const uploadPost =  async (start, end)=>{
  try{

    //spinner 실행
    spinner.start();

    //user 받기
    const curUser=getCurUser();

    // 함수 호출하여 db에 올리고 post id 받기
    const postId = await createPost({
      boardId: route.params.boardId, 
      title: route.params.title, 
      content: route.params.content,
      isEmer: route.params.isEmer, 
      image: route.params.image, 
      uid: curUser.uid, 
      startDate: start, 
      endDate: end,
    });

    await uploadImage(route.params.image, postId);

    // 전체 게시판
    if(route.params.boardId=='All'){
      navigation.navigate('AllBoard',{boardId: route.params.boardId, boardTitle: route.params.boardTitle, starUsers: route.params.starUsers});
    }
    // 건물 게시판
    else{
    // 해당 board로 다시 이동
    navigation.navigate('Board',{boardId: route.params.boardId, boardTitle: route.params.boardTitle, starUsers: route.params.starUsers});
    }
    
  }
    // 업로드 실패
    catch(err){
      console.log(err.message);
      Alert.alert("업로드 실패"); 
    }
    finally{
      // spinner 중지
      spinner.stop();
    }
}

//버튼 활성화 여부 업데이트
useEffect(()=> {
  setDisabled(!(startDate&&endDate));
}, [startDate, endDate]);


//header
useLayoutEffect(()=>{
  navigation.setOptions({
    headerRight: ()=> {
      return (
        <TouchableOpacity 
        disabled={disabled}
        onPress={ ()=> {
        // boardId 있으면 게시물 - 업로드 함수 호출, 장애물은 params 전달하며 이어서
        (route.params.boardId)? 
        uploadPost(startDate, endDate):
        navigation.navigate('SetBoard', {
          title: route.params.title, 
          content: route.params.content, 
          isEmer: route.params.isEmer, 
          image: route.params.image, 
          lat: route.params.lat, 
          long: route.params.long, 
          startDate: startDate, 
          endDate: endDate});
        }}
        style={{
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: theme.errText,
          marginRight: 10,
        }}
        >
        <Text
        style={{
          fontSize: 17,
          color: 'white',
        }}
        >{(route.params.boardId)? '완료': '다음'}
        </Text>
        </TouchableOpacity>
      );
    }
  })
});

  return (
    <Container>
      
      {/* 시작일 선택 버튼 */}
      <StyledText>시작일</StyledText>
      <TouchableOpacity
      style={{
        backgroundColor: '#CFDECE',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
      }}
      onPress={()=> {setDateVisible(1)}}>
        <Text
        style={{ 
          fontSize: 17,
          color: theme.l_btnTitle,
        }}
        >{`${startDate? moment(new Date(startDate)).format(DateFormat):"시작 날짜를 선택해 주세요"}`}</Text>
      </TouchableOpacity>

      {/* 종료일 선택 버튼 */}
      <StyledText>종료일</StyledText>
      <TouchableOpacity
      style={{
        backgroundColor: '#CFDECE',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
      }}
      onPress={()=> {setDateVisible(2)}}>
        <Text
        style={{ 
          fontSize: 17,
          color: theme.l_btnTitle,
        }}
        >{`${endDate? moment(new Date(endDate)).format(DateFormat):"종료 날짜를 선택해 주세요"}`}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={dateVisibleRef.current > 0}
        date={calendarDate}
        onDateChange={setCalendarDate}
        onConfirm={(date) => {
          let state = dateVisibleRef.current;
          setDateVisible(0);
          if (state == 1){
              setStartDate(moment(new Date(date)).format(DateFormat));
          }
          else if (state == 2) {
              setEndDate(moment(new Date(date)).format(DateFormat));
          }
        }}
        onCancel={() => {
          setDateVisible(0);
        }}
        cancelTextIOS="취소"
        confirmTextIOS="확인"
        textColor={'#82A480'}
      />


      {/* 건너뛰기 버튼 */}
      <View style={{width: '100%'}}>
        <TouchableOpacity
          style={{alignItems: 'flex-end'}}
          onPress={()=>{
            // 기간을 빈 문자열로 설정
            setStartDate('');
            setEndDate('');
            
            // 빈 문자열 설정하여 페이지 이동 
            (route.params.boardId)? 
            uploadPost('', ''):
            navigation.navigate('SetBoard', {
              title: route.params.title, 
              content: route.params.content, 
              isEmer: route.params.isEmer, 
              image: route.params.image, 
              lat: route.params.lat, 
              long: route.params.long, 
              startDate: '', 
              endDate: ''
            });
          }}
        >
          <StyledText
            style={{fontSize: 16, fontWeight: 'normal', textDecorationLine: 'underline',}}
          >&gt;&gt;  기간 설정 건너뛰기</StyledText>
        </TouchableOpacity>
      </View>
        
    </Container>
  );
};

