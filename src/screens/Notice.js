import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { TimeStamp } from '../components';
import {
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { DB } from "../firebase";

const Container = styled.View`
  flex: 1;
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
  border-color: ${({ theme }) => theme.lstBorder};
  padding: 20px 25px;
  padding-right: 15px;
`;
// 제목과 내용을 감싸는 컨테이너
const ItemTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;
// 제목
const ItemTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;

// 정보 컨테이너
const ItemInfo = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
`;

// 시간
const ItemTime = styled.Text`
  font-size: 14px;
  color: "black";
  margin-right: 10px;
`;

// 아이콘
const ItemIcon = styled(Ionicons).attrs(({ theme }) => ({
  name: "chevron-forward-sharp",
  size: 22,
  color: "black",
}))``;

//item 컴포넌트
const Item = React.memo(
  ({
    item: {
      title,
      content,
      createdAt,
      id,
      image,
    },
    onPress,
  }) => {
    return (
      <ItemContainer
        onPress={() =>
          onPress({
            title,
            content,
            createdAt,
            id,
            image,
          })
        }
      >
        <ItemTextContainer>
          <ItemTitle>{title}</ItemTitle>
        </ItemTextContainer>
        <ItemInfo>
          <ItemTime>{TimeStamp(createdAt)}</ItemTime>
        </ItemInfo>
        <ItemIcon />
      </ItemContainer>
    );
  }
);
// =-=- -=-=-

const Notice = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);

  //항목 목록 배열 상태 변수
  const [posts, setPosts] = useState([]);


  // 마운트될 때 동작
  // notice collection에서 모든 문서 읽어오기
  useEffect(() => {
    const q = query(collection(DB, "notice"),orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setPosts(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Item
            item={item}
            onPress={(params) => {
              navigation.navigate("NoticePost", params);
            }}
          />
        )}
        keyExtractor={(item) => item["id"]}
        windowSize={5}
      />
    </Container>
  );
};

export default Notice;
