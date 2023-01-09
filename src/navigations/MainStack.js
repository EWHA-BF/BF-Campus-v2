import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import { ThemeContext } from "styled-components";

import {
  Map,
  Notice,
  BoardList,
  EmerBoard,
  Board,
  CreatePost,
  AddImage,
  CreateMarker,
  SetBoard,
  SetDay,
  Post,
  MyPoint,
  AllBoard,
  FindRoute,
  FastRoute,
  MarkerPost,
} from "../screens";
import MainDrawer from "./MainDrawer";

const Stack = createStackNavigator();

//로그인 Yes 화면
const MainStack = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      initialRouteName="MainDrawer"
      screenOptions={{
        headerTintColor: theme.headerTitle,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
        headerShadowVisible: true,
        headerLeft: ({ onPress }) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={onPress}
          >
            <Ionicons
              name="chevron-back-outline"
              size={28}
              style={{
                marginHorizontal: 5,
                color: theme.headerTitle,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                alignSelf: "center",
                color: theme.headerTitle,
              }}
            >
              뒤로 가기
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      {/* 화면 1 */}
      <Stack.Screen
        name="MainDrawer"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      {/* 화면 2 */}
      <Stack.Screen name="Notice" component={Notice} />
      {/* 화면 3 */}
      <Stack.Screen
        name="Map"
        component={Map}
        options={({ navigation }) => ({
          headerTitle: "캠퍼스 지도",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              // Map은 무조건 뒤로가기하면 Home으로
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons
                name="chevron-back-outline"
                size={28}
                style={{
                  marginHorizontal: 5,
                  color: theme.headerTitle,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: "center",
                  color: theme.headerTitle,
                }}
              >
                뒤로 가기
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            // 길 찾기 버튼
            <TouchableOpacity
              style={{
                width: 40,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 4,
              }}
              onPress={() => navigation.navigate("FindRoute")}
            >
              <Ionicons
                name="arrow-redo-sharp"
                size={26}
                style={{
                  color: theme.headerTitle,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: theme.headerTitle,
                }}
              >
                길 찾기
              </Text>
            </TouchableOpacity>
          )
        })}
      />
      {/* 화면 4 */}
      <Stack.Screen
        name="FindRoute"
        component={FindRoute}
        options={{
          headerTitle: "경로 설정",
        }}
      />
      {/* 화면 5 */}
      <Stack.Screen
        name="FastRoute"
        component={FastRoute}
        options={{
          headerTitle: "경로 설명",
        }}
      />
      {/* 화면 6 */}
      <Stack.Screen
        name="EmerBoard"
        component={EmerBoard}
        options={{
          headerTitle: "긴급 게시판",
        }}
      />
      {/* 화면 7 */}
      <Stack.Screen
        name="BoardList"
        component={BoardList}
        options={{
          headerTitle: "전체 게시판",
        }}
      />
      {/* 화면 8 */}
      <Stack.Screen
        name="AllBoard"
        component={AllBoard}
        options={{
          headerTitle: "전체",
        }}
      />
      {/* 화면 9 */}
      <Stack.Screen name="MyPoint" component={MyPoint} />
      {/* 화면 10 */}
      <Stack.Screen name="Board" component={Board} />
      {/* 화면 11 */}
      <Stack.Screen
      name="MarkerPost" 
      component={MarkerPost} 
      options={{
        headerTitle: "장애물",
      }}/>
      {/* 화면 12 */}
      <Stack.Screen name="Post" component={Post} />

      {/* 글 올리는 화면들 */}
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          headerTitle: "글 쓰기",
        }}
      />
      <Stack.Screen
        name="AddImage"
        component={AddImage}
        options={{
          headerTitle: "사진 추가",
        }}
      />
      <Stack.Screen
        name="CreateMarker"
        component={CreateMarker}
        options={{
          headerTitle: "위치 설정",
        }}
      />
      <Stack.Screen
        name="SetBoard"
        component={SetBoard}
        options={{
          headerTitle: "게시판 설정",
        }}
      />
      <Stack.Screen
        name="SetDay"
        component={SetDay}
        options={{
          headerTitle: "기간 설정",
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
