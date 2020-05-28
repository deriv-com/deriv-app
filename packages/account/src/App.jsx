import React from 'react';
import Routes from 'Containers/routes.jsx';
import { setWebsocket } from 'Services/ws-methods';
import { MobxContentProvider } from 'Stores/connect';
import initStore from 'Stores/init-store';

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS, root_store, client_base },
        } = props;
        this.root_store = initStore(root_store, WS, client_base);
        setWebsocket(WS);
    }

    render() {
        return (
            <MobxContentProvider store={this.props.passthrough.root_store}>
                <Routes />
            </MobxContentProvider>
        );
    }
}

export default App;
