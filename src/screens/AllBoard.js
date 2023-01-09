import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import styled, { ThemeContext }  from 'styled-components';
import { TimeStamp } from '../components';
import { TouchableOpacity, Text, FlatList, Dimensions, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayRemove, arrayUnion, collectionGroup, } from "firebase/firestore";
import {getCurUser, DB} from '../firebase';

const Container = styled.View`
  flex : 1;
`;

const StyledText = styled.Text`
  font-size: 24px;
  color: black;
`;


//=-=- post item -=-=
// 컨테이너
const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${ ({theme}) => theme.lstBorder};
  padding: 20px 25px;
  padding-right: 15px;
`;
// 제목과 내용을 감싸는 컨테이너
const ItemTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;
// 제목
const ItemTitle =styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

// 정보 컨테이너
const ItemInfo = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
`

// 시간
const ItemTime = styled.Text`
  font-size: 14px;
  color: 'black';
  margin-right: 10px;
`;

// 기간
const ItemDate = styled.Text`
  font-size: 11px;
  color: 'grey';
  margin-right: 10px;
  margin-top: 8px;
`;

// 아이콘
const ItemIcon = styled(Ionicons).attrs(({theme}) => ({
  name: 'chevron-forward-sharp',
  size: 22,
  color: 'black',
}))``;


//item 컴포넌트
const Item= React.memo(
  ({item: {title, content, createdAt, uid, isEmer, id, image, startDate, endDate, markerId}, onPress}) => {

  return (
    <ItemContainer onPress={()=> onPress({title, content, createdAt, uid, isEmer, id, image, startDate, endDate, markerId})}>
      <ItemTextContainer>
        <ItemTitle>{title}</ItemTitle>
      </ItemTextContainer>
      <ItemInfo>
      <ItemTime>{TimeStamp(createdAt)}</ItemTime>
      {/* 기간 미정인 경우 미정으로 표시 */}
      {(startDate!=='')
      ?<ItemDate>{startDate} ~ {endDate}</ItemDate>
      :<ItemDate>기간 미정</ItemDate>
      }
      </ItemInfo>
      <ItemIcon />
    </ItemContainer>
  )
});
// =-=- -=-=-


// 모든 글 보여주는 게시판
const AllBoard = ({navigation, route})=> {
  const theme=useContext(ThemeContext);


  //user 불러오기
  const curUser=getCurUser();


  //항목 목록 배열 상태 변수
  const [posts, setPosts] = useState([]);

  const [star, setStar] = useState((route.params.starUsers.indexOf(curUser.uid))!==(-1));

  //header
  useLayoutEffect(()=>{
    navigation.setOptions({
      // board의 title을 전달받아 header title로 지정
      headerTitle : route.params.boardTitle,
      headerRight: ()=> {
        return( 
          star?
            <Ionicons 
            name="star" 
            size={24}
            style={{
              marginRight: 20,
            }}
            color='#f9a825'
            onPress={ () => {
              // 해당 board의 starUsers 배열에 가서 uid 삭제
              const arrRef = doc(DB, 'boards', `${route.params.boardId}`);
              updateDoc(arrRef, {
                starUsers: arrayRemove(`${curUser.uid}`)
              });
              setStar(false);
            }}/>
          :
            <Ionicons 
            name="star-outline" 
            size={22}
            style={{
              marginRight: 20,
            }}
            color='#00462a'
            onPress={ () => {
              // 해당 board의 starUsers 배열에 가서 uid 추가
              const arrRef = doc(DB, 'boards', `${route.params.boardId}`);
              updateDoc(arrRef, {
                starUsers: arrayUnion(`${curUser.uid}`)
              });
              setStar(true);
            }}/> 
        )
      }
    })
  });

  
  // 마운트될 때 동작
  // post collection에서 모든 문서 읽어오기
  useEffect(()=> {
    const q = query(collectionGroup(DB, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      let ind=0;
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
        // 중복글인지 체크
        list.map((item)=>{
          // post 하나씩 가져와서 제목이 같으면 list에서 pop
          if((item.title==doc.data().title)&& (list.indexOf(item)!==ind)){
            list.pop();
            ind--;
          }
        })
        ind++;
      });
      setPosts(list);
    });
    return ()=> unsubscribe();
  }, []);

  return (
    <Container>
      <FlatList 
      data={posts}
      renderItem={({item})=> 
      <Item 
      item={item} 
      onPress={params=>{
        navigation.navigate('Post', params);
      }}
      />}
      keyExtractor={item=>item['id']}
      windowSize={5}
      />

      <TouchableOpacity
      // 글 쓰기 버튼
      onPress={()=> {
        // 글 쓰기 버튼 누르면 뜨는 선택 창 - 게시물이면 board id 전달 / 장애물이면 전달 x
        Alert.alert(
          "게시글 유형을 선택해 주세요",
          "정보 공유 글 / 장애물 제보 글",
          [
            {
              text: "정보",
              onPress: () => {
                navigation.navigate('CreatePost', route.params)},
            },
            { text: "장애물", onPress: () => navigation.navigate('CreatePost') }
          ],
        );
        }}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 100,
        padding: 10,
        marginTop: 0,
        borderRadius: 30,
        position: 'absolute',
        bottom: 50,
        left: (Dimensions.get('window').width / 2)-(100/2),
      }}
      >
      <Ionicons 
        name="pencil-outline"
        size={16}
        style={{
          marginRight:10, 
          color: theme.d_btnBgColor,
        }}
      /> 
      <Text style={{
        fontSize: 18,
        color: theme.d_btnBgColor,
        fontWeight: 'bold'
      }}>글 쓰기</Text>

      </TouchableOpacity>
    </Container>
  );
} 

export default AllBoard;