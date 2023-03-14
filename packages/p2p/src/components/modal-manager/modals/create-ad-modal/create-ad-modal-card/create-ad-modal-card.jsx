import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, Icon } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockTradeAd from 'Assets/svgComponents/block-trade-ad.svg';
import './create-ad-modal-card.scss';

const CreateAdModalCard = ({ title, text, type }) => {
    const { hideModal } = useModalManagerContext();
    const { my_ads_store } = useStores();

    const onClickChoose = () => {
        my_ads_store.setAdType(type);
        my_ads_store.onClickCreate();
        hideModal();
    };

    return (
        <div className='ad-component'>
            {type === 'normal' ? <Icon icon='IcCashierNormalAd' width={48} height={48} /> : <BlockTradeAd />}
            <div className='ad-component__title'>
                <Text as='p' line_height='xxl' color='prominent' weight='bold'>
                    {title}
                </Text>
            </div>
            <div className='ad-component__content'>
                <Text size='xxs'>{text}</Text>
            </div>
            <div>
                <Button large primary onClick={onClickChoose}>
                    <Localize i18n_default_text='Choose' />
                </Button>
            </div>
        </div>
    );
};

export default observer(CreateAdModalCard);
