import classnames from 'classnames';
import React from 'react';
import { PropTypes } from 'prop-types';
import ContractCard from './contract-card.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/summary.scss';

const Summary = ({ is_mobile, is_drawer_open }) => (
    <div
        className={classnames('summary', {
            'run-panel-tab__content': !is_mobile,
            'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
        })}
    >
        <ContractCard />
    </div>
);

Summary.propTypes = {
    is_mobile: PropTypes.bool,
};

export default connect(({ ui }) => ({
    is_mobile: ui.is_mobile,
}))(Summary);
