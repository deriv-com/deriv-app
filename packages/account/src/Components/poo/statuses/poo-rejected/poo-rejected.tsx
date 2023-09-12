import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

type TPOORejected = {
    onTryAgain: () => void;
};

const POORejected = ({ onTryAgain }: TPOORejected) => (
    <div className='proof-of-ownership__container'>
        <div className='proof-of-ownership__container--content'>
            <IconMessageContent
                icon={<Icon icon='IcPooRejected' size={128} />}
                is_disabled_for_mobile
                message={<Localize i18n_default_text='Proof of ownership verification failed' />}
                text={<Localize i18n_default_text='We were unable to verify your proof of ownership.' />}
            />
            <Button
                className='proof-of-ownership__try-again-button'
                data-testid='dt_try-again-button'
                large
                onClick={onTryAgain}
                primary
                type='button'
            >
                <Localize i18n_default_text='Try again' />
            </Button>
        </div>
    </div>
);

export default POORejected;
