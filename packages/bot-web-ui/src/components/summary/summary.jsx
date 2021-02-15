import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { connect } from 'Stores/connect';
import SummaryCard from './summary-card.jsx';

const Summary = ({ is_mobile, is_drawer_open }) => (
    <div
        className={classnames('summary', {
            'run-panel-tab__content': !is_mobile,
            'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
        })}
    >
        <ThemedScrollbars>
            <SummaryCard />
        </ThemedScrollbars>
    </div>
);

Summary.propTypes = {
    is_mobile: PropTypes.bool,
};

export default connect(({ ui }) => ({
    is_mobile: ui.is_mobile,
}))(Summary);
