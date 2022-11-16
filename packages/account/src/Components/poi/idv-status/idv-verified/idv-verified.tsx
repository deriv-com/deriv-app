import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa/poa-button';
import IdvDocumentVerified from 'Assets/ic-idv-verified.svg';

type TIdvVerified = {
    needs_poa: boolean;
    is_from_external: boolean;
};

const IdvVerified = ({ needs_poa, is_from_external }: Partial<TIdvVerified>) => {
    const header_Text = needs_poa
        ? localize('Your ID is verified. You will also need to submit proof of your address.')
        : localize('ID verification passed');

    return (
        <div className='proof-of-identity__container' data-testid='poi_idv_verified_container'>
            <IdvDocumentVerified className='icon' />
            <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                {header_Text}
            </Text>
            {!!needs_poa && (
                <React.Fragment>
                    {!isMobile() && (
                        <Text className='text' size='xs' align='center'>
                            {localize("Next, we'll need your proof of address.")}
                        </Text>
                    )}
                    {!is_from_external && <PoaButton custom_text={localize('Submit proof of address')} />}
                </React.Fragment>
            )}
        </div>
    );
};

export default IdvVerified;
