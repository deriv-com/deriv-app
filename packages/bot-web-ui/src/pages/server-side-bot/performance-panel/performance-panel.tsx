import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import Journal from '../journal';
import Summary from '../summary';
import ClearJournalTransactions from '../bot-list/clear-journal-transactions';

const PerformancePanel = () => {
    const [active_index, setActiveTabIndex] = React.useState(0);
    const [is_clear_dialog_visible, setClearDialogVisibility] = React.useState(false);
    return (
        <>
            <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top className='ssb'>
                <div id='db-run-panel-tab__summary' label={localize('Summary')}>
                    <Summary setClearDialogVisibility={setClearDialogVisibility} />
                </div>
                <div id='db-run-panel-tab__journal' label={localize('Journal')}>
                    <Journal
                        setActiveTabIndex={setActiveTabIndex}
                        setClearDialogVisibility={setClearDialogVisibility}
                    />
                </div>
            </Tabs>
            <ClearJournalTransactions is_open={is_clear_dialog_visible} setVisibility={setClearDialogVisibility} />
        </>
    );
};

export default PerformancePanel;
