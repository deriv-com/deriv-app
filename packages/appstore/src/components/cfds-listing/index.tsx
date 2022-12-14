import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
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
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on successful trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='link' href='/dmt5' />]}
                    />
                </Text>
            }
        />
    );
};

export default CFDsListing;
