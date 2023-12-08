import { useFormikContext } from 'formik';
import { useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormData } from '../types';
import { Analytics } from '@deriv/analytics';

const useQsSubmitHandler = () => {
    const { client } = useStore();
    const { currency, balance, is_logged_in } = client;
    const { submitForm, setFieldValue, values } = useFormikContext<TFormData>();
    const { quick_strategy, run_panel } = useDBotStore();
    const { toggleStopBotDialog, setLossThresholdWarningData, loss_threshold_warning_data } = quick_strategy;

    const handleSubmit = async () => {
        const loss_amount = Number(values?.loss ?? 0);
        const profit_threshold = Number(values?.profit ?? 0);
        const stored_dont_show_warning_value = localStorage?.getItem('qs-dont-show-loss-threshold-warning');
        const dont_show_warning = JSON.parse(stored_dont_show_warning_value ?? 'false');
        if (
            !loss_threshold_warning_data.already_shown &&
            (loss_amount > 0.5 * Number(balance ?? 0) || loss_amount > 2 * profit_threshold) &&
            is_logged_in &&
            !dont_show_warning
        ) {
            setLossThresholdWarningData({
                show: true,
                loss_amount,
                currency,
                already_shown: true,
            });
        } else {
            proceedFormSubmission();
        }
    };

    const proceedFormSubmission = async () => {
        if (run_panel.is_running) {
            await setFieldValue('action', 'EDIT');
            submitForm();
            toggleStopBotDialog();
        } else {
            Analytics.trackEvent('ce_bot_quick_strategy_form', {
                action: 'run_strategy',
                form_source: 'ce_bot_quick_strategy_form',
            });
            await setFieldValue('action', 'RUN');
            submitForm();
        }
    };

    return { handleSubmit, proceedFormSubmission };
};

export default useQsSubmitHandler;
