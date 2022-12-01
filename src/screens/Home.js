import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Image, Button, TimeStamp } from '../components';
import { TouchableOpacity, View, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DB, getCurUser } from '../firebase';
import { collection, orderBy, onSnapshot, query, collectionGroup, where, } from "firebase/firestore";

const Container = styled.SafeAreaView`
  flex : 1;
  align-items: center;
  justify-content: space-evenly;
`;

const StyledText = styled.Text`
  font-size: 17px;
  color: #222222;
`;

const compoWidth = Dimensions.get('window').width - 20 * 3;

const StyledCompo_w = styled.View`
  background-color: white;
  border: 1px solid #E5E5E5;
  border-radius: 5px;
  width: ${compoWidth}px;
  height: 110px;
`;

const StyledCompo_g = styled.View`
background-color: #EDEDED;
border-radius: 5px;
width: ${compoWidth}px;
height: 100px;
`;

const CompoHeader = styled.View`
  height: 30px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${({ theme }) => theme.errText};
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  margin-bottom: 10px;
`;

const PostContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 10px;
  margin-vertical: 6px;
`;


const Home = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const curUser = getCurUser();

  //즐겨찾는 게시판 목록 배열 상태변수
  const [starboards, setStarboards] =useState([]);
  //긴급 글 목록 배열 상태변수
  const [emerposts, setEmerposts] = useState([]);
  
  // 마운트 될 때 동작
  // board collection 모든 문서 불러오기 
  useEffect(()=>{
    const q = query(collection(DB, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          //즐겨찾는 게시판이면 list에 push
          if(doc.data().starUsers.indexOf(curUser.uid)!==(-1)){
            list.push(doc.data());
          }
      });
      //list에서 4개만 가져와서 starboards 변수 업데이트
      setStarboards(list.slice(0,4));
    });
    
    return ()=> unsubscribe();
  }, []);

  // 마운트될 때 동작
  // 모든 post collection에서 isEmer=true인 문서 읽어오기 - 날짜 내림차순
  useEffect(()=> {
    const q = query(collectionGroup(DB, 'posts'), where('isEmer', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lst = [];
      querySnapshot.forEach((doc) => {
        lst.push(doc.data());
      });
      //lst에서 2개만 가져와서 emerposts 변수 업데이트
      setEmerposts(lst.slice(0,2));
    });
    return ()=> unsubscribe();
  }, []);

  return (
    <Container>

      {/* 공지사항 */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Notice')}
        activeOpacity={0.8}>
        <StyledCompo_g style={{ borderColor: theme.ewha_green }}>
          <CompoHeader style={{ backgroundColor: theme.d_btnBgColor }}>
            <StyledText style={{ color: 'white', flex: 6, fontSize: 17, fontWeight: 'bold' }}>공지사항</StyledText>
          </CompoHeader>
          {/* 내용 */}
          <View style={{  }}></View>
        </StyledCompo_g>
      </TouchableOpacity>
      

      {/* 지도 */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Map')}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'transparent',
          // 그림자
          //iOS
          shadowColor: "#000000", 
          shadowOpacity: 0.1,
          shadowRadius: 7,
          shadowOffset: { width: 2, height: 2 }, 
          //Android
          elevation: 5,
        }}
        >
        <Image
          url='https://i.imgur.com/thtIImL.jpg'
          containerStyle={{
            width: (Dimensions.get('window').width) - 20 * 3,
            height: 160,
            resizeMode: 'stretch',
            borderRadius: 5,
            opacity: 0.7,
          }} />
        <TouchableOpacity
          // 지도 보기 버튼
          onPress={ ()=>
            navigation.navigate('Map')
          }
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.d_btnBgColor,
            width: 110,
            padding: 8,
            marginTop: 0,
            borderRadius: 5,
            position: 'absolute',
            bottom: 10,
            left: (((Dimensions.get('window').width) - 20 * 3) / 2)-(120/2),
          }}
          >
          <Text style={{
            fontSize: 17,
            color: 'white',
            fontWeight: '600',
          }}>캠퍼스 지도</Text>
          </TouchableOpacity>
      </TouchableOpacity>

      {/*긴급 게시판*/}
      <TouchableOpacity
        onPress={() => navigation.navigate('EmerBoard')}
        activeOpacity={0.8}>
        <StyledCompo_w>
          <CompoHeader>
            <StyledText style={{ color: 'white', flex: 6, fontSize: 17, fontWeight: 'bold' }}>긴급 게시판</StyledText> 
          </CompoHeader>
           {/* 내용 */}
           <View style={{ 
           }}>
            {/* emerposts 이용하여 긴급 글 렌더링 */}
            {emerposts.map((item,index)=>{
              return(
                <PostContainer key={index}>
                  {/* 제목 */}
                  <StyledText style={{flex: 7, fontSize: 16}}>{item.title}</StyledText>
                  {/* N */}
                  <StyledText style={{flex: 0.5, marginHorizontal: 10, fontSize: 16, color: theme.errText, fontWeight: 'bold'}}>N</StyledText>
                  {/* 날짜,시간 */}
                  <StyledText style={{flex: 1.5, fontSize: 15, color: theme.lstContent}}>{TimeStamp(item.createdAt)}</StyledText>
                </PostContainer>
              );
            })}
          </View>
        </StyledCompo_w>
      </TouchableOpacity>

      {/*즐겨찾기 게시판*/}
      <TouchableOpacity
        onPress={() => {navigation.navigate('BoardList')}}
        activeOpacity={0.8}>
        <StyledCompo_w style={{height: 170}}>
          <CompoHeader style={{ backgroundColor: theme.d_btnBgColor }}>
            <StyledText style={{ color: 'white', flex: 6, fontSize: 17, fontWeight: 'bold' }}>즐겨찾는 게시판</StyledText>
          </CompoHeader>
          {/* 내용 */}
          <View style={{ 
           }}>
            {/* starboards 이용하여 즐겨찾는 게시판 렌더링 */}
            {starboards.map((item,index)=>{
              return(
                <TouchableOpacity 
                key={index}
                style={{
                  paddingLeft: 20,
                  marginVertical: 6,
                }}
                //클릭하면 params 주면서 Board로 이동
                onPress={()=>{
                  navigation.navigate('Board', {boardId: item.boardId, boardTitle: item.title, starUsers: item.starUsers});
                }}
                >
                  <StyledText>{item.title}</StyledText>
                </TouchableOpacity>
              );
            })}
          </View>
        </StyledCompo_w>
      </TouchableOpacity>
    </Container>
  );
}


export default Home;