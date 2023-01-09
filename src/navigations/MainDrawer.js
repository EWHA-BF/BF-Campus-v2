import React, {useContext, useState, useEffect} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { ThemeContext } from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Text, Alert, Modal, StyleSheet, View, Dimensions, Pressable} from 'react-native';
import {
  Home, 
  Notice,  
  Profile, 
  MyPoint, 
  FindPw,
  MyPost,
  NoticePost
} from '../screens';
import { DB, getCurUser } from '../firebase';
import { collectionGroup, query, where, onSnapshot, orderBy, limit, getDoc, doc, updateDoc } from "firebase/firestore";

const Drawer = createDrawerNavigator();


export default function MainDrawer() {
  const theme=useContext(ThemeContext);
  const curUser = getCurUser();
  const [modalVisible, setModalVisible] = useState(false);
  // modal에 렌더링할 text
  const [modalText, setModalText] = useState('');
  // 긴급 게시판에 올라온 가장 최신 글
  let last;


  // 마운트될 때 동작
  useEffect(() => {
    //user의 lastPost와 현재 가장 최신 글 비교하는 함수
    const lastPhotoFunc = async () => {
      const userRef = doc(DB, 'users', `${curUser.uid}`);
      const userSnap = await getDoc(userRef);
      const userLastPost=userSnap.data().lastPost; 

      // user의 lastPost 값이 가장 최신 글(last)과 같은지 체크하여 modalText 변경
      if (last.id == userLastPost) {
        setModalText('긴급 게시판에 등록된 새 글이 없습니다.');
      }
      else {
        setModalText('긴급 게시판에 새 글이 등록되었습니다. 지금 확인해 보세요!');
        // user의 lastPost 필드 업데이트
        const lastPostRef = doc(DB, 'users', `${curUser.uid}`);
        updateDoc(lastPostRef, {
          lastPost: last.id
        });
      }
    }

    // 현재 긴급 게시판에서 가장 최신 글 가져와 last에 저장
    const q = query(collectionGroup(DB, 'posts'), where('isEmer', '==', true), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        last=doc.data();
      });
    });

    // 함수 호출
    lastPhotoFunc();

    return () => unsubscribe();
  }, []);

  return (
    <Drawer.Navigator 
    initialRouteName='Home'
    backBehavior='order'
    screenOptions={{
      //header 설정
      headerTitleStyle: {
        fontSize: 20,
        color: theme.headerTitle,
        fontWeight: 'bold',
      },
      headerTintColor: theme.headerGrey,
      headerTitleAlign: 'left',
      headerBackTitleVisible: false,
      headerShadowVisible: true,

      //메뉴 설정
      drawerActiveTintColor: theme.headerTitle,
      drawerActiveBackgroundColor :'white',  
      drawerInactiveTintColor: 'black',
      drawerLabelStyle: {fontSize: 20, marginLeft: 5, fontWeight: 'bold'}
    }}>
        
    {/* screens */}
     {/* 화면 1 */}
      <Drawer.Screen 
      name='Home' 
      component={Home} 
      options={({navigation})=>({
        drawerLabel: '홈',
        title: 'BF campus',
        headerTitleStyle: {
          fontSize: 22,
          color: theme.headerTitle,
          fontWeight: 'bold',
        },
        // right buttons
        headerRight: ()=> (
          <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', width: 'auto', backgroundColor: 'white'}}>
          {/* modal */}
          <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
          >
            <View style={styles.centeredView}>
              {/* modal container */}
              <View style={styles.modalView}>
                {/* modal에 표시되는 text */}
                <Text style={styles.modalTextStyle}>{modalText}</Text>
                {/* 확인 버튼 */}
                <Pressable
                  style={styles.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  {/* 확인 text */}
                  <Text style={styles.closeText}>확인</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          {/* modal icon button */}
          <TouchableOpacity
          style={{
            backgroundColor: 'white', 
            width: 35, 
            height: 35, 
            justifyContent: 'center',
            alignContent: 'center',
          }}
          onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="notifications"
              size={22}
              color={theme.d_btnBgColor}
            />
          </TouchableOpacity>
          {/* point icon button*/}
          <TouchableOpacity
          style={{
            backgroundColor: '#EDEDED', 
            width: 35, 
            height: 35, 
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 50,
            marginRight: 20,
            marginLeft: 5,
          }}
          onPress={()=> navigation.navigate('MyPoint')}
          >
            <Text style={{
              fontSize: 20, 
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.headerTitle
            }}>P</Text>
          </TouchableOpacity>
          </View>
        )
      })}
     />
      {/* 화면 2 */}
      <Drawer.Screen 
      name='Notice' 
      component={Notice} 
      options={{
        drawerLabel: '공지사항',
        title: '공지사항',
      }}/>
      {/* 화면 3 */}
      <Drawer.Screen 
      name='Profile' 
      component={Profile} 
      options={{
        drawerLabel: '내 정보',
        title: '내 정보',
      }}/>
      {/* 화면 4 */}
      <Drawer.Screen 
      name='MyPost' 
      component={MyPost} 
      options={{
        drawerLabel: '내가 쓴 글',
        title: '내가 쓴 글',
        drawerLabelStyle: {fontSize: 17, marginLeft: 10},
      }}/>
      {/* 화면 5 */}
      <Drawer.Screen 
      name='MyPoint' 
      component={MyPoint} 
      options={{
        drawerLabel: '포인트 현황',
        title: '포인트 현황',
        drawerLabelStyle: {fontSize: 17, marginLeft: 10},
      }}/>
      {/* 화면 6 */}
      <Drawer.Screen 
      name='FindPw' 
      component={FindPw} 
      options={{
        title: '비밀번호 재설정',
        drawerItemStyle: { height: 0 },
        headerShown: true
      }}/>
      {/* 화면 7 */}
      <Drawer.Screen 
      name='NoticePost' 
      component={NoticePost} 
      options={{
        title: '공지사항',
        drawerItemStyle: { height: 0 },
        headerShown: true
      }}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  // modal container
  modalView: {
    backgroundColor: "white",
    width: (Dimensions.get('window').width) - 100,
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  // 확인 버튼
  buttonClose: {
    backgroundColor: '#00462A',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  // modal 화면 텍스트
  modalTextStyle: {
    marginBottom: 20,
    fontSize: 17,
    fontWeight: '600',
    textAlign: "center"
  },
  closeText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  }
}); 