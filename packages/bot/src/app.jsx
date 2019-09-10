import { Provider }             from 'mobx-react';
import React                    from 'react';
import { Drawer }               from 'deriv-components';
import { scratchWorkspaceInit } from './scratch';
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';
import Workspace                from './components/workspace.jsx';
import './assets/sass/app.scss';

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
                    <Drawer
                        is_open={true}
                        header='this is a drawer header'
                        footer='this is a drawer header'
                    >
                        <span>hey there</span>
                    </Drawer>
                </React.Fragment>
            </Provider>
        );
    }

    componentDidMount() {
        scratchWorkspaceInit();
        ApiHelpers.instance.registerAccountSwitcherListener();
    }

    componentWillUnmount() {
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }
        ApiHelpers.instance.disposeSwitchAccount();
    }
}

export default App;
