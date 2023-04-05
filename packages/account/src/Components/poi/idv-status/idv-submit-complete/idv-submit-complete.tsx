import IdvDocumentPending from 'Assets/ic-idv-document-pending.svg';
import PoaButton from 'Components/poa/poa-button';
import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TIdvSubmitComplete = {
    needs_poa: boolean;
    is_from_external: boolean;
    redirect_button: React.ReactNode;
};

const IdvSubmitComplete = ({ needs_poa, is_from_external, redirect_button }: TIdvSubmitComplete) => {
    const poa_button = !is_from_external && <PoaButton custom_text={localize('Submit proof of address')} />;

    return (
        <div className='proof-of-identity__container'>
            <IdvDocumentPending className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {localize('Your documents were submitted successfully')}
            </Text>
            <Text className='proof-of-identity__text text' size='xs' align='center'>
                {localize('We’ll review your documents and notify you of its status within 5 minutes.')}
            </Text>
            {needs_poa ? (
                <React.Fragment>
                    <Text className='text' size='xs' align='center'>
                        {localize("Next, we'll need your proof of address.")}
                    </Text>
                    {poa_button}
                </React.Fragment>
            ) : (
                redirect_button
            )}
        </div>
    );
};

export default IdvSubmitComplete;
