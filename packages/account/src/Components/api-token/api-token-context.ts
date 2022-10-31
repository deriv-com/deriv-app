import * as React from 'react';
import { TApiContext } from 'Types';

const ApiTokenContext = React.createContext<TApiContext>({});

export default ApiTokenContext;
