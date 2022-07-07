import classnames from 'classnames';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { connect } from 'Stores/connect';
import SummaryCard from './summary-card';
import RootStore from 'Stores/index';

interface TSummaryProps {
    is_mobile: boolean;
    is_drawer_open: boolean;
}

const Summary = ({ is_mobile, is_drawer_open }: TSummaryProps) => (
    <div
        className={classnames({
            'run-panel-tab__content': !is_mobile,
            'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
        })}
    >
        <ThemedScrollbars className='summary'>
            <SummaryCard />
        </ThemedScrollbars>
    </div>
);

export default connect(({ ui }: RootStore) => ({
    is_mobile: ui.is_mobile,
}))(Summary);
