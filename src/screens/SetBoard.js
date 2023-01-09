import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'styled-components';
import {Text, FlatList,} from 'react-native';
import { collection, onSnapshot, query, doc, updateDoc, } from "firebase/firestore";
import { TouchableOpacity, View, Alert, Dimensions} from 'react-native';
import Checkbox from 'expo-checkbox';
import {getCurUser, createBarrierPost, createMarker} from '../firebase';
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {storage, DB} from "../firebase";
import {ProgressContext} from '../contexts';



const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
`;

const StyledText = styled.Text`
  font-size: 16px;
  color: black;
  background-color: white;
  padding: 30px 10px;
  line-height: 30px;
`;

const BoardTitle = styled.Text`
  font-size: 18px;
  color: black;
`;



//장애물 게시판(건물) 설정 화면
export default function SetBoard({navigation, route}) {
  const theme=useContext(ThemeContext);
  const {spinner} = useContext(ProgressContext);


  //게시판 목록 배열 상태변수
  const [boards, setBoards] =useState([]);

  // storage에 이미지 올리기
  const uploadImage = async (image_uri, postId, boardId, markerId)=> {

    const response = await fetch(image_uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `post/${postId}/photo.jpg`);

    uploadBytes(storageRef, blob).then((snapshot) => {
    
    // storage에서 img 값 불러오기
    getDownloadURL(storageRef)
    .then((url) => {
      // post image url 업데이트
      const curDocRef = doc(DB, "boards", `${boardId}/posts/${postId}`);
      updateDoc(curDocRef, {
        image: url,
      });
      // marker image url 업데이트
      const markerDocRef= doc(DB, "markers", `${markerId}`);
      updateDoc(markerDocRef, {
        image: url,
      });
    })  
    .catch((error) => {
      console.log(error.message);
    });
    
  });
}

//글 업로드 함수
const uploadPost = async ()=>{
  try{
    
      //spinner 실행
      spinner.start();

      //user 받기
      const curUser=getCurUser();

      //marker 생성 함수 호출 후 markerId 받기
      const markerId = await createMarker(route.params.lat, route.params.long, route.params.title, route.params.content, route.params.image);

      // selected 배열 원소 각각 업로드 - 반복문
      selected.map(async (board)=>{
        //함수 호출하여 db에 올리고 post id 받기
        const postId = await createBarrierPost({
          boardId: board.boardId, 
          title: route.params.title, 
          content: route.params.content,
          isEmer: route.params.isEmer, 
          image: route.params.image, 
          uid: curUser.uid, 
          startDate: route.params.startDate, 
          endDate: route.params.endDate,
          lat: route.params.lat,
          long: route.params.long,
          markerId: markerId,
        });

        uploadImage(route.params.image, postId, board.boardId, markerId)
        .then(() => {
          const docRef = doc(DB, "markers", `${markerId}`);
          updateDoc(docRef, {
            postId: postId,
          });

          // 화면 이동
          navigation.navigate('Map');
        })  
        .catch((error) => {
          console.log(error.message);
        });
      })
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



  // 마운트 될 때 동작
  // board collection 모든 문서 불러오기 
  useEffect(()=>{
    const q = query(collection(DB, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        // 전체 게시판 제외
        if(doc.data().boardId!=='All'){
          list.push(doc.data());
        }
      });

      //boards 배열 업데이트
      let temp2 = list.map((dat) => {
        dat.isChecked=false;
      });
      setBoards(list);
    });
    
    return ()=> unsubscribe();
  }, []);

  //header
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight: ()=> {
        return (
          <TouchableOpacity 
          onPress={()=>{
            if(selected.length>2){
              Alert.alert(
                '3개 이상 선택할 수 없습니다'
              )
            }
            else if(selected.length==0){
              Alert.alert(
                '게시판을 선택해주세요'
              )
            }
            else{
            uploadPost()
            }
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
          >완료</Text>
          </TouchableOpacity>
        );
      }
    })
  });



  // 체크 박스 클릭하면
  const handleChange = (boardId) => {
    // board에서 isChecked 값을 변경
    let temp = boards.map((board) => {
      if (boardId === board.boardId) {
        return { ...board, isChecked: !board.isChecked };
      }
      return board;
    });
    // board 업데이트
    setBoards(temp);
  };

  // boards에서 isChecked=true인 애들만 selected에 저장
  let selected = boards.filter((board) => board.isChecked);


  // board flat list 렌더링
  const renderFlatList = (renderData) => {
    return (
      <FlatList
        data={renderData}
        renderItem={({ item }) => (
              //board container
              <View
                style={{
                  width: (Dimensions.get('window').width / 2)-(40),
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-start',
                  marginVertical: 10,
                }}>
                <Checkbox
                  value={item.isChecked}
                  onValueChange={() => {
                    handleChange(item.boardId);
                  }}
                />
                <Text style={{fontSize: 18, marginLeft: 20}}>{item.title}</Text>
              </View>
        )}
        keyExtractor={item=>item.boardId}
      />
    );
  };


  return (

    <Container>

    <StyledText>
      {
        `❕해당 글과 가장 관련 있는 건물을 선택해 주세요. 
❕건물은 최대 2개까지 선택할 수 있습니다.`
      }
    </StyledText>
      <View style={{ height: '60%' ,flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
        <View style={{paddingHorizontal: 10}}>{renderFlatList(boards.slice(0,10))}</View>
        <View style={{paddingHorizontal: 10}}>{renderFlatList(boards.slice(11,21))}</View>
      </View>
    </Container>

  );
};


