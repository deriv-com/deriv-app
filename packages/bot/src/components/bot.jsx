import React            from 'react';
import Workspace        from './workspace.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/_bot.scss';

const Bot = () => (
    <React.Fragment>
        <Workspace />
    </React.Fragment>
);

export default connect(({ bot }) => ({
    title: bot.title,
}))(Bot);
