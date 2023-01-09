import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.View`
`;

const BasicImg= styled.Image`
  background-color: white;
`;


const Image = ({url, containerStyle})=> {
  return (
    <Container>
      <BasicImg 
      source={{uri: url}}
      style={containerStyle}/>
    </Container>
  );
};


Image.propTypes={
  url: PropTypes.string,
  containerStyle: PropTypes.object,
}

export default Image;