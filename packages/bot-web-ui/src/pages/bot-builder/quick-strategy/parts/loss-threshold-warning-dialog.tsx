import React from 'react';
import { Checkbox, Dialog } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import useQsSubmitHandler from '../form-wrappers/useQsSubmitHandler';
import './loss-threshold-warning-dialog.scss';

const base_classname = 'loss-threshold-warning-dialog';

const LossThresholdWarningDialog = observer(() => {
    const { quick_strategy } = useDBotStore();
    const { loss_threshold_warning_data, setLossThresholdWarningData, initializeLossThresholdWarningData } =
        quick_strategy;
    const { proceedFormSubmission } = useQsSubmitHandler();

    const handleAmountEdit = () => {
        setLossThresholdWarningData({
            show: false,
            highlight_field: ['loss'],
        });
    };

    const handleContinueBot = () => {
        initializeLossThresholdWarningData();
        proceedFormSubmission();
    };

    const handleDontShowAgain = () => {
        const stored_dont_show_warning_value = localStorage?.getItem('qs-dont-show-loss-threshold-warning');
        const dont_show_warning = JSON.parse(stored_dont_show_warning_value ?? 'false');
        localStorage?.setItem('qs-dont-show-loss-threshold-warning', `${!dont_show_warning}`);
    };

    return (
        <Dialog
            portal_element_id='modal_root_absolute'
            title={localize('Are you sure you want to continue?')}
            is_visible={loss_threshold_warning_data.show}
            confirm_button_text={localize('Yes, continue')}
            onConfirm={handleContinueBot}
            cancel_button_text={localize('Edit the amount')}
            onCancel={handleAmountEdit}
            is_mobile_full_width={false}
            has_close_icon={false}
            className={base_classname}
        >
            <div className={`${base_classname}__body-text`}>
                <Localize
                    i18n_default_text={`Please confirm that your loss threshold amount is {{loss_amount}} {{currency}}.`}
                    values={{
                        loss_amount: loss_threshold_warning_data?.loss_amount,
                        currency: loss_threshold_warning_data?.currency,
                    }}
                />
            </div>
            <Checkbox
                defaultChecked={false}
                label={localize('Do not show this message again.')}
                onChange={handleDontShowAgain}
            />
        </Dialog>
    );
});

export default LossThresholdWarningDialog;
