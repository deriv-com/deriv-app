import React            from 'react';
import Workspace        from './workspace.jsx';
import LoadModal        from './modal/load-modal.jsx';
import SaveModal        from './modal/save-modal.jsx';
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
                <LoadModal />
                <SaveModal />
            </React.Fragment>
        );
    }
}

export default connect(({ bot }) => ({
    onMount  : bot.onMount,
    onUnmount: bot.onUnmount,
}))(Bot);
