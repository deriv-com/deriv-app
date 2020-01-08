import { Provider }         from 'mobx-react';
import React                from 'react';
import                           './public-path'; // Leave this here! OK boss!
import FooterExtension      from './components/footer-extension.jsx';
import MainContent          from './components/main-content.jsx';
import NotificationMessages from './components/notification-messages.jsx';
import QuickStrategy        from './components/quick-strategy.jsx';
import RunPanel             from './components/run-panel.jsx';
import Toolbar              from './components/toolbar.jsx';
import ServerTime           from './services/api/server_time';
import DBot                 from './scratch';
import ApiHelpers           from './services/api/api-helpers';
import RootStore            from './stores';
import ScratchStore         from './stores/scratch-store';
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
                <>
                    <NotificationMessages />
                    <div className='bot'>
                        <Toolbar />
                        <MainContent />
                        <RunPanel />
                        <QuickStrategy />
                        <FooterExtension />
                    </div>
                </>
            </Provider>
        );
    }
}
export default App;
