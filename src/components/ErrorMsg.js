import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 24px;
  margin-top: 10px;
  margin-bottom: 0px;
  line-height: 24px;
  font-size: 16px;
  color: ${ ({theme}) => theme.errText};
`;

const ErrorMsg = ({msg}) => {
  return (
    <StyledText>{msg}</StyledText>
  )
}

ErrorMsg.propTypes = {
  msg: PropTypes.string.isRequired,
}

export default ErrorMsg;