import classnames from 'classnames';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import SummaryCard from './summary-card';
import { isMobile } from '@deriv/shared';

const Summary = ({ is_drawer_open }: { is_drawer_open: boolean }) => {
    const is_mobile = isMobile();
    return (
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
};

export default Summary;
