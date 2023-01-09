import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Input 컨테이너
const Container = styled.View`
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
`;


// Input 입력창
const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder
}))
  `
  background-color: white;
  color: black;
  padding: 12px;
  font-size: 18px;
  border: 1px solid ${({ theme, isFocused }) => isFocused ? theme.inputFocused : theme.inputNotFocused};
  border-radius: 10px;
`;


const Input = forwardRef(
  (props, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Container>
        <StyledInput
          ref={ref}
          value={props.value}
          onChangeText={props.onChangeText}
          onSubmitEditing={props.onSubmitEditing}
          onBlur={() => {
            setIsFocused(false);
            props.onBlur();
          }}
          placeholder={props.placeholder}
          returnKeyType={props.returnKeyType}
          maxLength={props.maxLength}
          autoCapitalize='none'
          autoCorrect={false}
          textContentType='none'
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={props.isPassword}
          editable={!props.disabled}
        />
      </Container>
    );
  });

Input.defaultProps = {
  onBlur: () => { },
}

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  returnKeyType: PropTypes.oneOf(['done', 'next']),
  maxLength: PropTypes.number,
  isPassword: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default Input;