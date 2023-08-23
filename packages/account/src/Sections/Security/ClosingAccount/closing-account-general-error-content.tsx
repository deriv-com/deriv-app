import React from 'react';
import { localize } from '@deriv/translations';
import { Button } from '@deriv/components';

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
                {localize('OK')}
            </Button>
        </div>
    </React.Fragment>
);

export default ClosingAccountGeneralErrorContent;
