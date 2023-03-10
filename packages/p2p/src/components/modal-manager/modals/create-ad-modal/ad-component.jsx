import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './ad-component.scss';

const AdComponent = ({ title, text, type }) => {
    const { hideModal } = useModalManagerContext();
    const { my_ads_store } = useStores();

    const onClickChoose = () => {
        my_ads_store.setAdType(type);
        my_ads_store.onClickCreate();
        hideModal();
    };

    return (
        <div className='ad-component'>
            <Icon icon={type === 'normal' ? 'IcCashierNormalAd' : 'IcCashierBlockAd'} width={48} height={48} />
            <div className='ad-component__title'>
                <Text as='p' size='s' line_height='xxl' color='prominent' weight='bold'>
                    {title}
                </Text>
            </div>
            <div className='ad-component__content'>
                <Text size='xxs'>{text}</Text>
            </div>
            <div>
                <Button large primary onClick={onClickChoose}>
                    {localize('Choose')}
                </Button>
            </div>
        </div>
    );
};

export default observer(AdComponent);
