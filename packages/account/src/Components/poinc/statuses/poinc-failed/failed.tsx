import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';
import { income_status_codes } from 'Sections/Verification/ProofOfIncome/proof-of-income-utils';

type TPoincUnverified = {
    onReSubmit: (status: typeof income_status_codes[keyof typeof income_status_codes]) => void;
};

export const PoincFailed = ({ onReSubmit }: TPoincUnverified) => (
    <IconMessageContent
        message={<Localize i18n_default_text='Income verification failed' />}
        text={
            <Localize
                i18n_default_text="We were unable to verify your income. <0 /> Please check the email we've sent you for further information."
                components={[<br key={0} />]}
            />
        }
        icon={<Icon icon='IcPoincFailed' size={128} />}
    >
        <Button
            type='button'
            className='account-management__continue'
            onClick={() => onReSubmit(income_status_codes.NONE)}
            large
            primary
        >
            <Localize i18n_default_text='Try Again' />
        </Button>
    </IconMessageContent>
);
