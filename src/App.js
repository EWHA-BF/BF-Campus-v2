import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {theme} from './theme';
import Navigation from './navigations';
import { UserProvider, ProgressProvider } from './contexts';
import {SafeAreaProvider} from 'react-native-safe-area-context';



const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
      {/* ProgressProvider */}
      <ProgressProvider>

      {/* UserProvider */}
      <UserProvider>
        {/* 상태바 */}
        <StatusBar 
        backgroundColor='white'
        barStyle="dark-content"/>

        {/* 네비게이션 */}
        <Navigation />  
       
      </UserProvider>

     </ProgressProvider> 
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
