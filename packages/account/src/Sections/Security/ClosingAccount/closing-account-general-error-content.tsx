import { Fragment } from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

type TClosingAccountGeneralErrorContentProps = {
    message: string;
    onClick: () => void;
};

const ClosingAccountGeneralErrorContent = ({ message, onClick }: TClosingAccountGeneralErrorContentProps) => (
    <Fragment>
        <div className='closing-account-error__container closing-account-error__container-message'>
            <div className='closing-account-error__details closing-account-error__details-message'>
                <Text size='xs'>{message}</Text>
            </div>
        </div>
        <div>
            <Button className='closing-account-error__button' primary onClick={onClick}>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    </Fragment>
);

export default ClosingAccountGeneralErrorContent;
