//email 유효성 검사
//이화인 메일 검증
export const validateEmail = email => {
    const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[e]+[w]+[h]+[a]+[i]+[n]+\.[n]+[e]+[t]$/;
    return regex.test(email);
  }
  
  //입력값 공백 방지 함수
  export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
  };