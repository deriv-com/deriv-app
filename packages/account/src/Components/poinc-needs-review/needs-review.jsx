import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';

// need to be checked and refactored

export const NeedsReview = ({ is_description_enabled = true }) => {
    const message = localize("We've received your proof of income");

    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
            {is_description_enabled && (
                <React.Fragment>
                    <div className='account-management__text-container'>
                        <Text align='center' size='xs' as='p'>
                            {localize("We'll review your documents and notify you of its status within 3 days")}
                        </Text>
                    </div>
                </React.Fragment>
            )}
        </IconMessageContent>
    );
};
