import React from 'react';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';

// const HandleAssessment = () => {
//     const [is_form_visible, setIsFormVisible] = React.useState(true);
//     const [api_initial_load_error, setApiInitialLoadError] = React.useState(null);
//     const [is_btn_loading, setIsBtnLoading] = React.useState(false);
//     const [is_submit_success, setIsSubmitSuccess] = React.useState(false);
//     const [initial_form_values, setInitialFormValues] = React.useState({});

//     const showForm = is_visible => {
//         setIsFormVisible(is_visible);
//         setIsConfirmationVisible(false);
//     };

//     const onSubmit = async (values, { setSubmitting, setStatus }) => {
//         setStatus({ msg: '' });
//         setIsBtnLoading(true);
//         const form_payload = {
//             financial_information: { ...values },
//         };
//         const data = await setFinancialAndTradingAssessment(form_payload);
//         if (data.error) {
//             setIsBtnLoading(false);
//             setStatus({ msg: data.error.message });
//         } else {
//             WS.authorized.storage.getFinancialAssessment().then(res_data => {
//                 setInitialFormValues(res_data.get_financial_assessment);
//                 setIsSubmitSuccess(true);
//                 setIsBtnLoading(false);

//                 if (isDesktop()) {
//                     setTimeout(() => setIsSubmitSuccess(false), 10000);
//                 }

//                 removeNotificationMessage({ key: 'risk' });
//                 removeNotificationByKey({ key: 'risk' });
//             });
//             setSubmitting(false);
//         }
//     };

//     const validateFields = values => {
//         setIsSubmitSuccess(false);
//         const errors = {};
//         Object.keys(values).forEach(field => {
//             if (!values[field]) {
//                 errors[field] = localize('This field is required');
//             }
//         });
//         return errors;
//     };

// }

const TradingAssessment = () => {
    return (
        <form>
            <FormBody>
                <FormSubHeader
                    title={localize('Trading Experience')}
                    subtitle={`(${localize('All fields are required')})`}
                />
            </FormBody>
        </form>
    );
};

export default TradingAssessment;
