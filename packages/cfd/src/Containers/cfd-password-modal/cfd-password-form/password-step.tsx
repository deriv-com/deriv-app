import React from 'react';
import { FormikErrors, FormikHelpers } from 'formik';
import { CFD_PLATFORMS } from '@deriv/shared';
import { MultiStep } from '@deriv/components';
import ChangePasswordConfirmation from '../../cfd-change-password-confirmation';
import CreatePassword from './create-password';
import { TCFDPasswordFormReusedProps, TCFDPasswordFormValues, TOnSubmitPassword } from '../../props.types';

type TPasswordStepProps = TCFDPasswordFormReusedProps & {
    has_mt5_account: boolean;
    submitPassword: TOnSubmitPassword;
    is_real_financial_stp: boolean;
    handlePasswordInputChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        handleChange: (el: React.ChangeEvent<HTMLInputElement>) => void,
        validateForm: (values?: TCFDPasswordFormValues) => Promise<FormikErrors<TCFDPasswordFormValues>>,
        setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
    ) => void;
};

type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};

const PasswordStep = ({
    has_mt5_account,
    platform,
    error_message,
    validatePassword,
    submitPassword,
    is_real_financial_stp,
    handlePasswordInputChange,
}: TPasswordStepProps) => {
    const multi_step_ref = React.useRef<TMultiStepRefProps>();
    const [password, setPassword] = React.useState('');

    const onSubmit: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5 && has_mt5_account) {
            setPassword(values.password);
            multi_step_ref.current?.goNextStep();
        } else {
            submitPassword(values, actions);
        }
    };

    const steps = [
        {
            component: (
                <CreatePassword
                    password={password}
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    onSubmit={onSubmit}
                    is_real_financial_stp={is_real_financial_stp}
                    handlePasswordInputChange={handlePasswordInputChange}
                />
            ),
        },
        {
            component: (
                <ChangePasswordConfirmation
                    className='cfd-password-modal__change-password-confirmation'
                    platform={platform}
                    onConfirm={(_values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) =>
                        submitPassword({ password }, actions)
                    }
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
    ];

    return <MultiStep ref={multi_step_ref} steps={steps} />;
};

export default PasswordStep;
