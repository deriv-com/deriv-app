import React from 'react';

const GlobalAgent = React.createContext({});
export const AgentProvider = GlobalAgent.Provider;
export const AgentConsumer = GlobalAgent.Consumer;

export default GlobalAgent;
