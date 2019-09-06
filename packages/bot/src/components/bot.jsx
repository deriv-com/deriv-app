import React            from 'react';
import Workspace        from './workspace.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/bot.scss';

class Bot extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
        this.props.onMount();
    }

    // eslint-disable-next-line class-methods-use-this
    componentWillUnmount() {
        this.props.onUnmount();
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <React.Fragment>
                <Workspace />
            </React.Fragment>
        );
    }
}

export default connect(({ bot }) => ({
    onMount  : bot.onMount,
    onUnmount: bot.onUnmount,
}))(Bot);
