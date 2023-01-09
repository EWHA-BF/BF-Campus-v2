import {FlatList, Dimensions} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styled, { ThemeContext } from 'styled-components';
import {getCurUser, DB} from '../firebase';
import { doc, getDoc, query, collection, onSnapshot, orderBy } from "firebase/firestore";
import { theme } from '../theme';


const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;


//=-=- point item -=-=
// 컨테이너
const ItemContainer = styled.View`
  height: 70px;
  width: ${Dimensions.get('window').width - 60}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${ ({theme}) => theme.lstBorder};
  border-radius: 5px;
  padding: 15px;
  margin-vertical: 10px;
`;

// 내용 컨테이너
const ItemContent =styled.Text`
  width: 100%;
  height: 25px;
  align-items: flex-start;
`;

// 정보 컨테이너
const ItemInfo = styled.View`
  flex-direction: row;
  width: 100%;
  height: 25px;
  align-items: center;
  justify-content: space-between;
`;

const ItemText = styled.Text`
  font-size: 19px;
  color: black;
`;

//item 컴포넌트
const Item= React.memo(
  ({content, date, score}) => {

  return (
    <ItemContainer>
      {/* 내용 */}
      <ItemContent>
        <ItemText
        style={{
          fontWeight: 'bold',
        }}
        >{content}</ItemText>
      </ItemContent>

      {/* 정보 */}
      <ItemInfo>
        {/* 포인트 점수 */}
        <ItemText
        style={{
          fontSize: 19,
          fontWeight: 'bold',
          color: theme.l_greenText,
        }}
        >{'+ '+score+' P'}</ItemText>
        {/* 날짜 */}
        <ItemText
        style={{
          fontSize: 15,
          color: theme.lstContent,
        }}
        >{date.toDate().toString().slice(4,10)+' '+date.toDate().toString().slice(13,15)}</ItemText>
      </ItemInfo>
    </ItemContainer>
  )
});


export default function MyPoint({navigation}) {

  const theme=useContext(ThemeContext);

  // 포인트 상태 변수
  const [userPoint, setUserPoint] = useState('0');
  // 포인트 내역 상태 변수
  const [points, setPoints] = useState([]);

  //현재 로그인한 사용자 정보 받아오기
  const curUser=getCurUser();

  // 마운트될 때 동작
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

  // 마운트될 때 동작
  // 사용자 points collection에서 모든 문서 읽어오기
  useEffect(()=> {
    const q = query(collection(DB, 'users', `${curUser.uid}/points`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setPoints(list);
    });
    return ()=> unsubscribe();
  }, []);

  return (
    <Container>

      {/* 내 포인트 */}
      <ItemContainer
      style={{
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'transparent',
        borderRadius: 8,
        backgroundColor: theme.lstContainer,
        marginBottom: 20,
      }}>
        <ItemText 
        style={{
          color: 'white',
          fontWeight: 'bold'
        }}>내 포인트</ItemText>
        <ItemText
        style={{
          color: 'white',
          fontWeight: 'bold'
        }}>{userPoint+ ' P'}</ItemText>
      </ItemContainer>
      

      {/* 포인트 내역 */}
      <FlatList 
      data={points}
      renderItem={({item})=> 
        <Item 
        content={item.content}
        date={item.createdAt}
        score={item.score}
        />
      }
      keyExtractor={item=>item.createdAt.toString()}
      />
    </Container>
  );
};

