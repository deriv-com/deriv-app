import { Provider }             from 'mobx-react';
import React                    from 'react';
// TODO:  move to core once it's ready
import                          'deriv-translations';
import                          './public-path'; // Leave this here! OK boss!
import FooterExtension          from './components/footer-extension.jsx';
import MainContent              from './components/main-content.jsx';
import Toolbar                  from './components/toolbar.jsx';
import RunPanel                 from './components/run-panel.jsx';
import QuickStrategy            from './components/quick-strategy.jsx';
import { scratchWorkspaceInit } from './scratch/index';
import ApiHelpers               from './services/api/api-helpers';
import ServerTime               from './services/api/server_time';
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
