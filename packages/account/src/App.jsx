import React from 'react';
import Routes from 'Containers/routes.jsx';
import { setWebsocket } from 'Services/ws-methods';
import { MobxProvider } from 'Stores/connect';
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
            <MobxProvider store={this.props.passthrough.root_store}>
                <Routes />
            </MobxProvider>
        );
    }
}

export default App;
