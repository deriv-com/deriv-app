import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import Journal from '../journal';
import Summary from '../summary';

const PerformancePanel: React.FC = () => {
    const [active_index, setActiveTabIndex] = React.useState(0);
    return (
        <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top className='ssb'>
            <div id='db-run-panel-tab__summary' label={localize('Summary')}>
                <Summary />
            </div>
            <div id='db-run-panel-tab__journal' label={localize('Journal')}>
                <Journal setActiveTabIndex={setActiveTabIndex} />
            </div>
        </Tabs>
    );
};

export default PerformancePanel;
