import React from 'react';
import { connect } from '../stores/connect';

const Bot = ({
    title,
}) => (
    <div>{title}</div>
);

export default connect(({ bot }) => ({
    title:bot.title,
}))(Bot);
