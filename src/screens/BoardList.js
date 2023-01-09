import React, { useState, useEffect, useContext } from "react";
import styled, { ThemeContext} from "styled-components";
import { FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DB, getCurUser } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

//--item--
// item container
const ItemContainer = styled.TouchableOpacity`
  width: ${width - 20}px;
  height: 45px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
`;
// item text

const ItemBoardText = styled.Text`
  font-size: 19px;
  color: ${({ theme }) => theme.greenText};
  font-weight: bold;
  padding-left: 20px;
  padding-right: 10px;
  flex: 4;
`;

const ItemPostText = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.lstContent};
  flex: 5;
  padding-right: 15px;
`;

const ItemIconText = styled.Text`
  font-size: 19px;
  color: ${({ theme }) => theme.errText};
  font-weight: bold;
  flex: 1;
`;

//item 컴포넌트
const Item = React.memo(({ item: { boardId, title, starUsers }, onPress }) => {
  const theme = useContext(ThemeContext);
  const curUser = getCurUser();

  return (
    <ItemContainer onPress={() => onPress({ boardId, title, starUsers })}>
      <ItemBoardText>{title}</ItemBoardText>
      <ItemPostText></ItemPostText>
      <ItemIconText>
        <Ionicons
          name="chevron-forward-outline"
          size={23}
          onPress={onPress}
          color={theme.l_btnBgColor}
        />
      </ItemIconText>
    </ItemContainer>
  );
});

//--main--
const Container = styled.View`
  flex: 1;
  background-color: white;
  //padding-vertical: 30px; // 해당되는 것이 없어 주석처리함.
`;

const BoardList = ({ navigation }) => {
  const theme = useContext(ThemeContext);

  //게시판 목록 배열 상태변수
  const [boards, setBoards] = useState([]);

  // 마운트 될 때 동작
  // board collection 모든 문서 불러오기
  useEffect(() => {
    const q = query(collection(DB, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      //boards 변수 업데이트
      setBoards(list);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Container>
      <FlatList
        data={boards}
        renderItem={({ item }) => (
          <Item
            item={item}
            //클릭하면 params 주면서 Board로 이동
            onPress={(params) => {
              // 전체 게시판
              if (params.boardId == "All") {
                navigation.navigate("AllBoard", {
                  boardId: params.boardId,
                  boardTitle: params.title,
                  starUsers: params.starUsers,
                });
              }
              // 건물 게시판
              else {
                navigation.navigate("Board", {
                  boardId: params.boardId,
                  boardTitle: params.title,
                  starUsers: params.starUsers,
                });
              }
            }}
          />
        )}
        keyExtractor={(item) => item["boardId"]}
        windowSize={5}
        contentContainerStyle={{
          alignItems: "center",
        }}
      />
    </Container>
  );
};
export default BoardList;
