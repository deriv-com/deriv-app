// import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'Stores/connect';

const Workspace = (props) => {  
  return (  
    <React.Fragment>
      <WebView
          ref={ref => props.setWebViewRef(ref)}
          style={styles.scratch}
          originWhitelist={['*']}
          source={{ uri: 'https://scratch.mit.edu/projects/editor/?tutorial=getStarted' }}
          allowFileAccess={true}
          mixedContentMode={'always'}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          useWebKit={true}
          startInLoadingState={true}
      />
    </React.Fragment>
)};

const styles = StyleSheet.create({
  scratch: {
    backgroundColor: '#ffffee',
    color: '#000001',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 0,
  },
});

export default connect(({ workspace }) => ({
    setWebViewRef: workspace.setWebViewRef,
}))(Workspace);