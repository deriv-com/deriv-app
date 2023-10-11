import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import RiskManagementDialog from 'Modules/Trading/Containers/Multiplier/risk-management-dialog';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const RiskManagementInfo = observer(() => {
    const {
        currency,
        stop_loss,
        take_profit,
        has_take_profit,
        has_stop_loss,
        cancellation_duration,
        cancellation_range_list,
        has_cancellation,
    } = useTraderStore();
    const [is_dialog_open, setDialogOpen] = React.useState(false);
    const has_risk_management = has_take_profit || has_stop_loss || has_cancellation;
    const toggleDialog = () => {
        setDialogOpen(!is_dialog_open);
    };
    const cancellation_label = cancellation_range_list.find(r => r.value === cancellation_duration)?.text;

    return (
        <React.Fragment>
            <RiskManagementDialog
                is_open={is_dialog_open}
                toggleDialog={toggleDialog}
                onClose={() => setDialogOpen(false)}
            />
            <div
                className='mobile-widget mobile-widget__multiplier-risk-management'
                onClick={() => setDialogOpen(!is_dialog_open)}
            >
                {!has_risk_management && (
                    <div className='mobile-widget__item'>
                        <div className='mobile-widget__item-label'>{localize('Risk management')}</div>
                        <div className='mobile-widget__item-value'>{localize('Not set')}</div>
                    </div>
                )}
                {has_take_profit && (
                    <div className='mobile-widget__item'>
                        <div className='mobile-widget__item-label'>{localize('Take profit')}</div>
                        <div className='mobile-widget__item-value'>
                            <Money amount={take_profit} currency={currency} show_currency />
                        </div>
                    </div>
                )}
                {has_stop_loss && (
                    <div className='mobile-widget__item'>
                        <div className='mobile-widget__item-label'>{localize('Stop loss')}</div>
                        <div className='mobile-widget__item-value'>
                            <Money amount={stop_loss} currency={currency} show_currency />
                        </div>
                    </div>
                )}
                {has_cancellation && (
                    <div className='mobile-widget__item'>
                        <div className='mobile-widget__item-label'>{localize('Deal Cancellation')}</div>
                        <div className='mobile-widget__item-value'>{cancellation_label}</div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
});

export default RiskManagementInfo;
