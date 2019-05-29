import React from 'react';
import { connect } from '../stores/connect';
import '../assets/sass/_bot.scss';

const Bot = ({
    title,
}) => (
    <div className='main'>{title}</div>
);

export default connect(({ bot }) => ({
    title: bot.title,
}))(Bot);
