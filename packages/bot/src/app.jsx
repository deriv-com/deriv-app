import { Provider }             from 'mobx-react';
import React                    from 'react';
import Bot                      from './components/bot.jsx';
import { scratchWorkspaceInit } from './scratch';
import RootStore                from './stores';

class App extends React.Component {
    constructor(props){
        super(props);
        
        const { passthrough: { WS, root_store } } = props;

        this.rootStore = new RootStore(root_store, WS);
    }

    render() {
        return (
            <Provider {...this.rootStore}>
                <Bot>{this.rootStore.bot.title}</Bot>
            </Provider>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
        scratchWorkspaceInit('scratch_area', 'scratch_div', this.rootStore);
    }
}

export default App;
