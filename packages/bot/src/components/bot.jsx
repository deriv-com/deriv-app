import React            from 'react';
import Workspace        from './workspace.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/bot.scss';

class Bot extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

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
