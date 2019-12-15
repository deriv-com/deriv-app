import { Provider }             from 'mobx-react';
import React                    from 'react';
import                               './public-path'; // Leave this here! OK boss!
import FooterExtension          from './components/footer-extension.jsx';
import MainContent              from './components/main-content.jsx';
import NotificationMessages     from './components/notification-messages.jsx';
import QuickStrategy            from './components/quick-strategy.jsx';
import RunPanel                 from './components/run-panel.jsx';
import Toolbar                  from './components/toolbar.jsx';
import ApiHelpers               from './services/api/api-helpers';
import ServerTime               from './services/api/server_time';
import DBot, { 
    scratchWorkspaceInit 
}                               from './scratch';
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';
import Firestore                from './utils/firestore';
import './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.root_store = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.root_store);
        Firestore.init(this.root_store);
        ServerTime.init(root_store.common);
    }

    componentDidMount() {
        DBot.initWorkspace();
        ApiHelpers.instance.registerOnAccountSwitch();
        scratchWorkspaceInit();
    }

    componentWillUnmount() {
        ApiHelpers.instance.disposeOnAccountSwitch();
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
    }

    render() {
        return (
            <Provider {...this.root_store}>
                <div className='bot'>
                    <NotificationMessages />
                    <Toolbar />
                    <MainContent />
                    <RunPanel />
                    <QuickStrategy />
                    <FooterExtension />
                </div>
            </Provider>
        );
    }
}
export default App;
