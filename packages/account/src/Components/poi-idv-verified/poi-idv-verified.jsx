import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa-button';
import IdvDocumentVerified from '../../Assets/ic-idv-verified.svg';

const IdvVerified = ({ needs_poa }) => {
    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentVerified className='icon btm-spacer' />
            <Text className='proof-of-identity__header' align='center' weight='bold'>
                {localize('Your document number has been verified')}
            </Text>
            {needs_poa && (
                <React.Fragment>
                    <Text className='text' size='xs' align='center'>
                        {localize("Next, we'll need your proof of address.")}
                    </Text>
                    <PoaButton custom_text={localize('Submit proof address')} />
                </React.Fragment>
            )}
        </div>
    );
};

export default IdvVerified;
