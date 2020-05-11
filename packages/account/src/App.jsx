import React from 'react';
import Routes from 'Containers/routes.jsx';
import { setWebsocket } from 'Services/ws-methods';
import { MobxProvider } from 'Stores/connect';

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS },
        } = props;
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
