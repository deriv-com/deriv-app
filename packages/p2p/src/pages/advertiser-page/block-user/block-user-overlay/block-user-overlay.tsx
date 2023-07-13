import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores/index';

type TBlockUserOverlayProps = {
    is_visible: boolean;
    onClickUnblock: () => void;
};

const BlockUserOverlay = ({
    children,
    is_visible,
    onClickUnblock,
}: React.PropsWithChildren<TBlockUserOverlayProps>) => {
    const { advertiser_page_store } = useStores();

    if (is_visible) {
        return (
            <div className='block-user-overlay'>
                <div className='block-user-overlay__wrapper'>
                    <Icon icon='IcBlock' height={159} width={256} />
                    <Text className='block-user-overlay__wrapper-text' weight='bold'>
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
    return <>{children}</>;
};

export default observer(BlockUserOverlay);
