import { Provider }             from 'mobx-react';
import React                    from 'react';
import { scratchWorkspaceInit } from './scratch';
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';
import RunPanel                 from './components/run-panel.jsx';
import Workspace                from './components/workspace.jsx';
import                               './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.rootStore = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.rootStore);
    }

    render() {
        return (
            <Provider {...this.rootStore}>
                <React.Fragment>
                    <Workspace />
                    <RunPanel />
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
