import { useFormikContext } from 'formik';
import { useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { SERVER_BOT_LOSS_THRESHOLD_WARNING } from '../constants';
import { TFormValues } from '../types';

const useSubmitHandler = () => {
    const { client } = useStore();
    const { currency, balance, is_logged_in } = client;
    const { submitForm, values, validateForm } = useFormikContext<TFormValues>();
    const { server_bot } = useDBotStore();
    const { setLossThresholdWarningData, loss_threshold_warning_data } = server_bot;

    const handleSubmit = async () => {
        const loss_amount = Number(values?.loss ?? 0);
        const profit_threshold = Number(values?.profit ?? 0);
        const stored_dont_show_warning_value = localStorage?.getItem(SERVER_BOT_LOSS_THRESHOLD_WARNING);
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

    const proceedFormSubmission = () => {
        validateForm();
        submitForm();
    };

    return { handleSubmit, proceedFormSubmission };
};

export default useSubmitHandler;
