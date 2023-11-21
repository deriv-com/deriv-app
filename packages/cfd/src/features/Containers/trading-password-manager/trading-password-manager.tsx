import React from 'react';
import { MultiStep } from '@deriv/components';
import { localize } from '@deriv/translations';
import ChangePasswordConfirmation from 'Containers/cfd-change-password-confirmation';
import { TPasswordResetAndTradingPasswordManager } from 'Containers/props.types';
import { ChangePassword } from './change-password';
import { PasswordReset } from './password-reset';

const TradingPasswordManager = ({ platform, email, account_group }: TPasswordResetAndTradingPasswordManager) => {
    const multi_step_ref = React.useRef<{ goNextStep: () => void; goPrevStep: () => void }>();

    const steps = [
        {
            component: <ChangePassword platform={platform} onConfirm={() => multi_step_ref.current?.goNextStep()} />,
        },
        {
            component: (
                <ChangePasswordConfirmation
                    confirm_label={localize('Confirm')}
                    platform={platform}
                    onConfirm={() => multi_step_ref.current?.goNextStep()}
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
        {
            component: <PasswordReset platform={platform} email={email} account_group={account_group} />,
        },
    ];

    return (
        <div className='cfd-trading-password'>
            <MultiStep ref={multi_step_ref} steps={steps} />
        </div>
    );
};

export default TradingPasswordManager;
