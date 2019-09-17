import { Provider }             from 'mobx-react';
import React                    from 'react';
import { Drawer, Tabs }         from 'deriv-components';
import { scratchWorkspaceInit } from './scratch';
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';
import Workspace                from './components/workspace.jsx';
import './assets/sass/app.scss';

const drawerContent = () => {
    return (
        <Tabs>
            <div label='Summary'>
                Summary goes hear!
            </div>
            <div label='Transations'>
                Transations goes hear!
            </div>
            <div label='Journal'>
                Journal goes hear!
            </div>
        </Tabs>
    );
};

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.rootStore = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.rootStore);
    }

    render() {
        const content = drawerContent();
        
        return (
            <Provider {...this.rootStore}>
                <React.Fragment>
                    <Workspace />
                    <Drawer
                        is_open={true}
                        footer='this is a drawer footer'
                    >
                        {content}
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
