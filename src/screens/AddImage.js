import {Text} from 'react-native';
import React, {useState, useEffect, useLayoutEffect, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'styled-components';
import { TouchableOpacity, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const Container = styled.View`
  flex : 1;
  background-color: white;
  align-items: center;
  justify-content: center; 
  padding: 10px 20px;
`;

const StyledImg= styled.Image`
  background-color: ${({ theme }) => theme.imgBg};
  width: ${Dimensions.get('window').width-80}px;
  height: ${Dimensions.get('window').width-80}px;
  border-radius: 10px;
`;


// 사진 추가 화면
export default function AddImage({navigation, route}) {

  const theme=useContext(ThemeContext);
  const [disabled, setDisabled] = useState(true);
  const [image, setImage] = useState(null);

   //사진 버튼 클릭 - 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


    //버튼 활성화 여부 업데이트
    useEffect(()=> {
    setDisabled(!image);
    }, [image])



  //header
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight: ()=> {
        return (
          <TouchableOpacity 
          onPress={ ()=> {
            (route.params.boardId)?
            navigation.navigate('SetDay', {boardId: route.params.boardId, boardTitle: route.params.boardTitle, starUsers: route.params.starUsers, title: route.params.title, content: route.params.content, isEmer: route.params.isEmer, image: image}):
            navigation.navigate('CreateMarker', {title: route.params.title, content: route.params.content, isEmer: route.params.isEmer, image: image})
          }}
          disabled={disabled}
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
          >다음</Text>
          </TouchableOpacity>
        );
      }
    })
  });


return (
  <Container>

    {/* 이미지 */}
    <StyledImg source={{ uri: image }} />

    <TouchableOpacity
      onPress={pickImage}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: theme.imgBtn,
        width: 100,
        padding: 10,
        marginTop: 0,
        borderRadius: 30,
        position: 'absolute',
        bottom: 50,
        left: (Dimensions.get('window').width / 2)-(100/2),
      }}>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.imgBtn,
    }}>사진 수정</Text>
    </TouchableOpacity>

  </Container>
);
} 

