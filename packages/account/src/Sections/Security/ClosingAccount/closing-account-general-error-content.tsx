import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TClosingAccountGeneralErrorContentProps = {
    message: string;
    onClick: () => void;
};

const ClosingAccountGeneralErrorContent = ({ message, onClick }: TClosingAccountGeneralErrorContentProps) => (
    <React.Fragment>
        <div className='closing-account-error__container closing-account-error__container-message'>
            <div className='closing-account-error__details closing-account-error__details-message'>{message}</div>
        </div>
        <div>
            <Button className='closing-account-error__button' primary onClick={onClick}>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    </React.Fragment>
);

export default ClosingAccountGeneralErrorContent;
