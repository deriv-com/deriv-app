import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const IdvNoSubmissions = ({ handleRequireSubmission }) => {
    return (
        <div className='proof-of-identity__container'>
            <Icon icon='IcPoiFailed' className='icon' size={128} />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {isMobile() ? localize('ID verification failed') : localize('Verification of document number failed')}
            </Text>
            <Text className='proof-of-identity__text btm-spacer' align='center' size='xs'>
                {localize('We were unable to verify your identity based on the details you entered. ')}
                {!isMobile() && <br />}
                {localize('Please upload your identity document.')}
            </Text>
            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Upload identity document')}
                primary
            />
        </div>
    );
};

export default IdvNoSubmissions;
