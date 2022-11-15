import React from 'react';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IdvDocumentRejected from 'Assets/ic-idv-document-rejected.svg';

type TIdvRejected = {
    handleRequireSubmission: () => void;
};

const IdvRejected = ({ handleRequireSubmission }: TIdvRejected) => {
    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentRejected className='icon' size={128} />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {localize('ID verification failed')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {localize('We were unable to verify your ID with the details you provided.')}
            </Text>
            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Try again')}
                primary
            />
        </div>
    );
};

export default IdvRejected;
