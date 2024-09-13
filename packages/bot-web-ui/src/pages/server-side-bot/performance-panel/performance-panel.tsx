import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import Journal from '../journal';
import Summary from '../summary';

const PerformancePanel = () => {
    const [active_index, setActiveTabIndex] = React.useState(0);
    const [is_clear_dialog_visible, setClearDialogVisibility] = React.useState(false);
    return (
        <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top className='ssb'>
            <div id='db-run-panel-tab__summary' label={localize('Summary')}>
                <Summary
                    is_clear_dialog_visible={is_clear_dialog_visible}
                    setClearDialogVisibility={setClearDialogVisibility}
                />
            </div>
            <div id='db-run-panel-tab__journal' label={localize('Journal')}>
                <Journal
                    setActiveTabIndex={setActiveTabIndex}
                    is_clear_dialog_visible={is_clear_dialog_visible}
                    setClearDialogVisibility={setClearDialogVisibility}
                />
            </div>
        </Tabs>
    );
};

export default PerformancePanel;
