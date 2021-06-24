import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const IdvExpired = ({ handleRequireSubmission }) => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiFailed' className='icon btm-spacer' size={128} />
            <Text className='proof-of-identity__status-header' align='center' weight='bold'>
                {localize('Verification of document number failed')}
            </Text>
            <Text className='proof-of-identity__status-header' align='center' size='xs'>
                {localize('It looks like your identity document has expired. Please try again with a valid document.')}
            </Text>
            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Try Again')}
                primary
            />
        </div>
    );
};

export default IdvExpired;
