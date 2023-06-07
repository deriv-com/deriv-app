import classnames from 'classnames';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import SummaryCard from './summary-card';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { TContractInfo } from './summary-card.types';
import RootStore from 'Stores/index';

type TSummary = {
    is_drawer_open: boolean;
    is_contract_loading: boolean;
    contract_info?: TContractInfo;
};

const Summary = ({ is_drawer_open, is_contract_loading, contract_info }: TSummary) => {
    const is_mobile = isMobile();
    return (
        <div
            className={classnames({
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
                'run-panel-tab__content--summary-tab': !is_mobile && is_drawer_open,
            })}
        >
            <ThemedScrollbars
                className={classnames({
                    summary: !is_contract_loading && !contract_info,
                    'summary--loading':
                        (is_mobile && is_contract_loading) || (is_mobile && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard is_contract_loading={is_contract_loading} contract_info={contract_info} />
            </ThemedScrollbars>
        </div>
    );
};

export default connect(({ summary_card }: RootStore) => ({
    is_contract_loading: summary_card.is_contract_loading,
    contract_info: summary_card.contract_info,
}))(Summary);
