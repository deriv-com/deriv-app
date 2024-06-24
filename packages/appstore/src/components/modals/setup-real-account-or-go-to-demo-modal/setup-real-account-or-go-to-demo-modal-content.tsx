import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Button, Icon, Text } from '@deriv/components';
import { useContentFlag } from '@deriv/hooks';

type TModalContent = {
    is_responsive?: boolean;
};

export const SetupRealAccountOrGoToDemoModalContent = observer(({ is_responsive = false }: TModalContent) => {
    const { ui, traders_hub } = useStore();
    const { openRealAccountSignup, setIsFromSignupAccount } = ui;
    const { setIsSetupRealAccountOrGoToDemoModalVisible } = traders_hub;

    const { is_cr_demo, is_eu_demo } = useContentFlag();

    const onSetupRealAccountButtonClick = () => {
        setIsSetupRealAccountOrGoToDemoModalVisible(false);

        if (is_cr_demo) {
            openRealAccountSignup('svg');
            setIsFromSignupAccount(false);
        } else if (is_eu_demo) {
            openRealAccountSignup('maltainvest');
            setIsFromSignupAccount(false);
        }
    };

    const onToDemoButtonClick = () => {
        setIsSetupRealAccountOrGoToDemoModalVisible(false);
    };

    return (
        <div className='setup-real-account-or-go-to-demo-modal'>
            <Icon icon='IcAppstoreAccount' width={120} height={152} />
            <Text
                size={is_responsive ? 'sm' : 'm'}
                weight='bold'
                className='setup-real-account-or-go-to-demo-modal__title'
            >
                <Localize i18n_default_text='Start your trading journey' />
            </Text>
            <div className='setup-real-account-or-go-to-demo-modal__buttons'>
                <Button primary large onClick={onSetupRealAccountButtonClick}>
                    <Localize i18n_default_text='Set up your real account' />
                </Button>
                <Button secondary large onClick={onToDemoButtonClick}>
                    <Localize i18n_default_text='Take me to demo' />
                </Button>
            </div>
        </div>
    );
});
