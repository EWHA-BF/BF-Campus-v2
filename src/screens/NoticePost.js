import React from "react";
import styled from "styled-components";
import {
  Dimensions,
  ScrollView,
} from "react-native";
import { TimeStamp } from "../components";

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
`;

const StyledText = styled.Text`
  font-size: 18px;
  background-color: white;
  color: black;
`;

const StyledInput = styled.TextInput`
  background-color: white;
  color: black;
  padding: 13px;
  font-size: 18px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  width: 100%;
  margin-top: 20px;
`;

const StyledImg = styled.Image`
  width: ${Dimensions.get("window").width - 50}px;
  height: ${Dimensions.get("window").width - 50}px;
  border-radius: 10px;
  margin: 20px;
  margin-bottom: 100px;
`;

const HeaderText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 40px;
  padding: 0 10px;
`;

const NoticePost = ({ route }) => {

  return (
    <ScrollView>
      <Container>
        {/* 헤더 */}
        <HeaderText>
          <StyledText>관리자</StyledText>
          <StyledText
            style={{
              fontSize: 15,
            }}
          >
            {TimeStamp(route.params.createdAt)}
          </StyledText>
        </HeaderText>

        {/* 제목 */}
        <StyledInput
          label="title"
          value={route.params.title}
          editable={false}
        />

        {/* 내용 */}
        <StyledInput
          label="desc"
          value={route.params.content}
          multiline={true}
          style={{
            height: 300,
            maxHeight: 300,
            textAlignVertical: "top",
          }}
          editable={false}
        />

        {/* 이미지 */}
        <StyledImg source={{ uri: route.params.image }} />
      </Container>
    </ScrollView>
  );
};

export default NoticePost;
