
import React, { Component } from 'react';
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
}                           from 'react-native';
import {
  WebView }                 from 'react-native-webview';

// import { scratchHtml } from './src/components/scratch/index';

import { DBot }             from '@deriv/bot-skeleton/dist/bot-skeleton';

//   const scratch_div = document.getElementById('scratch_div');
//   scratch_div.style.backgroundColor= '#889999';
//   scratch_div.style.width='100vw';
//   scratch_div.style.height='100vh';
//   scratch_div.appendChild(scratch_div);
// xDBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helpers_store);
// `;

class App extends Component {
  render() {
    return (
      <>
      <WebView 
      style={styles.scratch}
      originWhitelist={["*"]}
      // source={Platform.OS === 'ios' ?
      //  undefined: 
      //  {uri: 'file:///android_asset/scratch.html'}
      // }
      // source={{html : scratchHtml}}
      allowFileAccess={true}
      mixedContentMode={'always'}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      useWebKit={true}
      startInLoadingState={true}
      />
      <Button
        title='Import Bot' 
        color='#ff444f'
        onPress={()=>{Alert.alert('Import strategy' , ' Coming soon...')}}
       >
       </Button>
      <Button 
        title='Run Bot'
        color='#4bb4b3'
        onPress={()=>{Alert.alert('Run Bot' , 'Coming soon...')}}></Button>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scratch: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 0,
  },
});

export default App;
