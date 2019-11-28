import { Provider }             from 'mobx-react';
import React                    from 'react';
import                               './public-path'; // Leave this here!
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';
import Toolbar                  from './components/toolbar.jsx';
import RunPanel                 from './components/run-panel.jsx';
import Workspace                from './components/workspace.jsx';
import QuickStrategy            from './components/quick-strategy.jsx';
import { scratchWorkspaceInit } from './scratch';
import firestore                from './utils/firestore';

import './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.root_store = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.root_store);
        firestore.init(this.root_store);
    }

    render() {
        return (
            <Provider {...this.root_store}>
                <React.Fragment>
                    <Toolbar />
                    <Workspace />
                    <RunPanel />
                    <QuickStrategy />
                </React.Fragment>
            </Provider>
        );
    }

    componentDidMount() {
        scratchWorkspaceInit();
        ApiHelpers.instance.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
        ApiHelpers.instance.disposeOnAccountSwitch();
    }
}
export default App;
