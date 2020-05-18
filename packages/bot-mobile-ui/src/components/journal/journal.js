import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'Stores/connect';

const Journal = ({ onMount, onUnmount, messages }) => {
  useEffect(() => {
    onMount();
    return () => onUnmount();
  }, []);

  
  return (
    <View style={{
      height: 200,
    }}>
      { messages.map(message => <Text key={Date.now()}>{ message }</Text>) }
    </View>
  )
};

export default connect(({ journal }) => ({
    messages: journal.messages,
    onMount: journal.onMount,
    onUnmount: journal.onUnmount,
}))(Journal);