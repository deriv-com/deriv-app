import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import './cfds-listing.scss';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import AddOptionsAccount from 'Components/add-options-account';

const CFDsListing = () => {
    const { tradinghub } = useStores();
    const is_real = tradinghub.selected_account_type === 'real';
    const has_no_real_account = !tradinghub.has_any_real_account;
    return (
        <ListingContainer
            title={
                <Text size='sm' line_height='m' weight='bold'>
                    <Localize i18n_default_text='CFD Listing' />
                </Text>
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='link' href='/dmt5' />]}
                    />
                </Text>
            }
        >
            {is_real && has_no_real_account && (
                <div className='cfd-full-row'>
                    <AddOptionsAccount />
                </div>
            )}

            <div className='cfds-listing'>CFD Listing</div>
        </ListingContainer>
    );
};

export default observer(CFDsListing);
