import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import * as BotSkeleton from '@deriv/bot-skeleton';
import Workspace from 'Components/workspace/workspace';
import Journal from 'Components/journal/journal';
import RootStore from 'Stores';
import { MobxContentProvider } from 'Stores/connect';

const App = () => {
  const [root_store] = useState(new RootStore());

  useEffect(() => {
    // TODO: Set up API helper store properly.
    const api_helpers_store = { 
      ws: root_store.api, 
      server_time: { clone: () => {} }, 
    };

    // TODO: Initialise in-memory workspace.
    BotSkeleton.DBot.initMobile(root_store, api_helpers_store);
  }, []);

  return (
    <MobxContentProvider store={root_store}>
        <Workspace />
        <Journal />
        <Button 
          title="Run bot" 
          color="#4bb4b3" 
          onPress={() => { BotSkeleton.DBot.emitObserverEvent() }} 
        />
    </MobxContentProvider>
  );
};

export default App;
