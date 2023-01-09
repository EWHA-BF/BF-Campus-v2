import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';

//버튼 컨테이너 기본 값
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  marginTop: 0px;
  marginBottom: 25px;
  padding: 15px;
  background-color: ${ ({theme}) => theme.d_btnBgColor};
`;

//버튼 타이틀 기본 값
const Title = styled.Text`
  font-size: 20px;
  color: white;
  fontWeight: 600,
`;


const Button = ({title, onPress, containerStyle, textStyle, disabled})=> {
  return (
    <TouchableOpacity 
    style={{flexDirection: 'row'}}
    onPress={onPress}
    disabled={disabled}>
      <Container style={containerStyle} disabled={disabled}>
        <Title style={textStyle}>
          {title}
        </Title>
      </Container>
    </TouchableOpacity>
   
  )
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Button;