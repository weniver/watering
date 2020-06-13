import * as React from 'react';
import { Text } from 'react-native';

export function TestText(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}
