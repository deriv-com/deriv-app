import React            from 'react';
import Header           from './header/header.jsx';
import Workspace        from './workspace.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/_bot.scss';

const Bot = () => (
    <React.Fragment>
        <Header />
        <Workspace />
    </React.Fragment>
);

export default connect(({ bot }) => ({
    title: bot.title,
}))(Bot);
