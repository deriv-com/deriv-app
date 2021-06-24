import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa-button';
import IdvDocumentPending from '../../Assets/ic-idv-document-pending.svg';

const IdvUploadComplete = ({ needs_poa }) => {
    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentPending className='icon btm-spacer' />
            <Text className='proof-of-identity__header' align='center' weight='bold'>
                {localize("We've received your document number")}
            </Text>
            <Text className='text' size='xs' align='center'>
                {localize("We'll process your details within a few minutes and notify its' status via email.")}
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

export default IdvUploadComplete;
