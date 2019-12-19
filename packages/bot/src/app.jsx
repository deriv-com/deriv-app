import { Provider }         from 'mobx-react';
import React                from 'react';
/* eslint import/first: 0 */
import                           './public-path'; // Leave this here! OK boss!
import ApiHelpers           from 'Api/api-helpers';
import ServerTime           from 'Api/server_time';
import RootStore            from 'Stores';
import ScratchStore         from 'Stores/scratch-store';
import FooterExtension      from './components/footer-extension.jsx';
import MainContent          from './components/main-content.jsx';
import NotificationMessages from './components/notification-messages.jsx';
import QuickStrategy        from './components/quick-strategy.jsx';
import RunPanel             from './components/run-panel.jsx';
import Toolbar              from './components/toolbar.jsx';
import DBot                 from './scratch';
import GTM                  from './utils/gtm';
import                      './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.root_store = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.root_store);
        GTM.init(this.root_store);
        ServerTime.init(root_store.common);
    }

    componentDidMount() {
        DBot.initWorkspace();
        ApiHelpers.instance.registerOnAccountSwitch();
    }

    componentWillUnmount() {
        if (Blockly.derivWorkspace) {
            Blockly.derivWorkspace.dispose();
        }

        ApiHelpers.instance.disposeOnAccountSwitch();
        ScratchStore.instance.disposeReactions();
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
