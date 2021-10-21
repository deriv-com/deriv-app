import '../public-path'; // Leave this here (at the top)! OK boss!
import React from 'react'; // eslint-disable-line import/first
import { DBot } from '@deriv/bot-skeleton'; // eslint-disable-line import/first
import { MobxContentProvider } from 'Stores/connect';
import RootStore from 'Stores';
import AppContainer from './app-container.jsx';

const App = ({ passthrough }) => {
    const { root_store, WS } = passthrough;
    const root_store_instance = React.useRef(new RootStore(root_store, WS, DBot));

    return (
        <MobxContentProvider store={root_store_instance.current}>
            <AppContainer />
        </MobxContentProvider>
    );
};

export default App;
