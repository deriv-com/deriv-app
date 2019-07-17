import React            from 'react';
import Workspace        from './workspace.jsx';
import { Tutorial }     from './tutorial.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/_bot.scss';

const Bot = () => (
    <React.Fragment>
        <Tutorial />
        <Workspace />
    </React.Fragment>
);

export default connect(({ bot }) => ({
    title: bot.title,
}))(Bot);
