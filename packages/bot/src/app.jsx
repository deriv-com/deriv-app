import { Provider }             from 'mobx-react';
import React                    from 'react';
import                          './public-path'; // Leave this here! OK boss!
import MainContent              from './components/main-content.jsx';
import Toolbar                  from './components/toolbar.jsx';
import RunPanel                 from './components/run-panel.jsx';
import QuickStrategy            from './components/quick-strategy.jsx';
import ApiHelpers               from './services/api/api-helpers';
import RootStore                from './stores';

import './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.rootStore = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.rootStore);
    }

    componentDidMount() {
        ApiHelpers.instance.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        ApiHelpers.instance.disposeOnAccountSwitch();
    }

    render() {
        return (
            <Provider {...this.rootStore}>
                <React.Fragment>
                    <Toolbar />
                    <MainContent />
                    <RunPanel />
                    <QuickStrategy />
                </React.Fragment>
            </Provider>
        );
    }
}
export default App;
