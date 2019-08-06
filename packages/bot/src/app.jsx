
import { Provider } from 'mobx-react';
import React        from 'react';
import Button       from 'deriv-components/lib/button'; // eslint-disable-line import/no-unresolved
// import Bot          from './components/bot.jsx';
import RootStore    from './stores';

class App extends React.Component {
    rootStore = new RootStore();

    render() {
        return (
            <Provider {...this.rootStore}>
                {/* <Bot>{this.rootStore.bot.title}</Bot> */}
                <Button name='test button' className='button-primary' />
            </Provider>
        );
    }
}

export default App;
