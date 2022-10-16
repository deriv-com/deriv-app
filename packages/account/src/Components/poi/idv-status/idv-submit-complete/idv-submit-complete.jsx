import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa/poa-button';
import IdvDocumentPending from 'Assets/ic-idv-document-pending.svg';

const IdvSubmitComplete = ({ needs_poa, is_from_external }) => {
    const poa_button = !is_from_external && <PoaButton custom_text={localize('Submit proof of address')} />;

    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentPending className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {localize('Your ID number was submitted successfully')}
            </Text>
            <Text className='proof-of-identity__text text' size='xs' align='center'>
                {localize("We'll process your details within a few minutes and notify its status via email.")}
            </Text>
            {!!needs_poa && (
                <React.Fragment>
                    <Text className='text' size='xs' align='center'>
                        {localize("Next, we'll need your proof of address.")}
                    </Text>
                    {poa_button}
                </React.Fragment>
            )}
        </div>
    );
};

export default IdvSubmitComplete;
