import React, {useState, createContext} from 'react';

const ProgressContext  = createContext({
  inProgress: false,
  spinner: {
    start: ()=> {}, 
    stop: ()=> {}
  }
});

//진행중인지 여부 확인하여 spinner 렌더링 여부 결정
const ProgressProvider = ({children})=> {
  const [inProgress, setInProgress]=useState(false);
  const spinner={
    start: ()=> setInProgress(true),
    stop: ()=> setInProgress(false),
  }

  const value={inProgress, spinner};
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;

}

export {ProgressContext, ProgressProvider};