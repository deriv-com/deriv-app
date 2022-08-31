import * as React from 'react';

const ApiTokenContext = React.createContext<Partial<import('Types').TApiContext>>({});

export default ApiTokenContext;
