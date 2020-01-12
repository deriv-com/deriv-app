import { Provider }         from 'mobx-react';
import React                from 'react';
import { gtm }              from 'deriv-bot-engine/dist/utils';
import { ServerTime,
    ApiHelpers }            from 'deriv-bot-engine/dist/services';

// import DBot                 from 'deriv-bot-engine';
import                           './public-path'; // Leave this here! OK boss!
import FooterExtension      from './components/footer-extension.jsx';
import MainContent          from './components/main-content.jsx';
import NotificationMessages from './components/notification-messages.jsx';
import QuickStrategy        from './components/quick-strategy.jsx';
import RunPanel             from './components/run-panel.jsx';
import Toolbar              from './components/toolbar.jsx';
import RootStore            from './stores';
import ScratchStore         from './stores/scratch-store';
import                      './assets/sass/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { passthrough: { WS, root_store } } = props;
        this.root_store = new RootStore(root_store, WS);
        ApiHelpers.setInstance(this.root_store);
        gtm.init(this.root_store);
        ServerTime.init(root_store.common);
    }

    componentDidMount() {
        // DBot.initWorkspace();
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
