import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';
import { TPoincStatusCodes } from 'Sections/Verification/ProofOfIncome/proof-of-income-utils';

type TPoincUnverified = {
    onReSubmit: (status: keyof TPoincStatusCodes) => void;
};

export const PoincUnverified = ({ onReSubmit }: TPoincUnverified) => (
    <IconMessageContent
        message={localize('Income verification failed')}
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
            onClick={() => onReSubmit('none')}
            large
            text={localize('Try Again')}
            primary
        />
    </IconMessageContent>
);
