import React from 'react';
import Routes from './Containers/routes.jsx';
import { setWebsocket } from './Services/ws-methods';
import { MobxContentProvider } from './Stores/connect';

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS, root_store },
        } = props;
        setWebsocket(WS);
        this.root_store = root_store;
    }

    render() {
        return (
            <MobxContentProvider store={this.root_store}>
                <Routes />
            </MobxContentProvider>
        );
    }
}

export default App;
