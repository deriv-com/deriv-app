import { Provider }             from 'mobx-react';
import React                    from 'react';
import Bot                      from './components/bot.jsx';
import { scratchWorkspaceInit } from './scratch';
import RootStore                from './stores';

class App extends React.Component {
    rootStore = new RootStore();

    render() {
        return (
            <Provider {...this.rootStore}>
                <Bot>{this.rootStore.bot.title}</Bot>
                {/* <Button text='test button' className='button-primary' /> */}
            </Provider>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
        scratchWorkspaceInit('scratch_area', 'scratch_div');
    }
}

export default App;
