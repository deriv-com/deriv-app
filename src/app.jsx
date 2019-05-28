
import React from 'react';
import { Provider } from 'mobx-react';
import RootStore from './stores';
import Bot from './components/bot.jsx';

class App extends React.Component {
    rootStore = new RootStore();

    render() {
        return (
            <Provider {...this.rootStore}>
                <Bot>{this.rootStore.bot.title}</Bot>
            </Provider>
        );
    }
}

export default App;
