import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';

const BlockUserOverlay = ({ children, is_visible, onClickUnblock }) => {
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
                    <Button className='block-user-overlay__wrapper-button' large onClick={onClickUnblock} secondary>
                        <Localize i18n_default_text='Unblock' />
                    </Button>
                </div>
                {children}
            </div>
        );
    }
    return children;
};

BlockUserOverlay.propTypes = {
    children: PropTypes.any,
    is_visible: PropTypes.bool.isRequired,
    onClickUnblock: PropTypes.func,
};

export default observer(BlockUserOverlay);
