import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import './block-user-overlay.scss';
import PropTypes from 'prop-types';

const BlockUserOverlay = ({ children, is_visible, onUnblock }) => {
    const { advertiser_page_store } = useStores();

    if (is_visible) {
        return (
            <div className='block-user-overlay'>
                <div className='block-user-overlay__wrapper'>
                    <Icon icon='IcBlock' height={159} width={256} />
                    <Text className='block-user-overlay__wrapper-text' line_height='m' size='s' weight='bold'>
                        <Localize
                            i18n_default_text='You have blocked {{advertiser_name}}.'
                            values={{ advertiser_name: advertiser_page_store.advertiser_details_name }}
                        />
                    </Text>
                    <Button className='block-user-overlay__wrapper-button' secondary onClick={onUnblock} large>
                        {localize('Unblock')}
                    </Button>
                </div>
                {children}
            </div>
        );
    }
    return <>{children}</>;
};

BlockUserOverlay.propTypes = {
    children: PropTypes.any,
    /**
     * Controls the visibility of the overlay
     */
    is_visible: PropTypes.bool.isRequired,
    /**
     * Function handler when Unblock button is clicked
     */
    onUnblock: PropTypes.func.isRequired,
};

export default observer(BlockUserOverlay);
