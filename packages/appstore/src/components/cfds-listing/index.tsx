import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import './cfds-listing.scss';

const CFDsListing = () => {
    return (
        <ListingContainer
            title={
                <Text size='sm' line_height='m' weight='bold'>
                    <Localize i18n_default_text='CFD Listing' />
                </Text>
            }
            description={
                <Text size='xs' line_height='s'>
                    Trade with leverage and tight spreads for better returns on successful trades. Learn more
                </Text>
            }
        >
            <div className='cfds-listing'>CFD Listing</div>
        </ListingContainer>
    );
};

export default CFDsListing;
