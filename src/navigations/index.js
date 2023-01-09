import React, { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import {UserContext, ProgressContext} from '../contexts';
import {Spinner} from '../components';

// 기본 배경 색 지정
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Navigation = () => {
  //user 설정
  const { user } = useContext(UserContext);

  //progress 설정
  const {inProgress} = useContext(ProgressContext);

  return (
    //Navigation Container
    <NavigationContainer theme={MyTheme}>
      {/* 로그인 +인증 여부에 따라 다른 화면 렌더링 */}
      {user.uid && user.emailVerified ? <MainStack /> : <AuthStack />}
      {/* <AuthStack/> */}
      {/* <MainStack /> */}

      {/* 진행중이면 spinner 렌더링 */}
      {inProgress && <Spinner/>}
    </NavigationContainer>
  );
};

export default Navigation;
