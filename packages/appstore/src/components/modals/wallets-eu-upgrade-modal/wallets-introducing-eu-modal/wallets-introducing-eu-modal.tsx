import React from 'react';

import { Button, Icon, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import './wallets-introducing-eu-modal.scss';

type TProps = {
    is_open: boolean;
    onClickHandler: () => void;
};

const WalletsIntroducingEuModal: React.FC<TProps> = observer(({ is_open, onClickHandler }) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return (
        <Modal
            className='wallets-introducing-eu-modal'
            is_open={is_open}
            width={is_desktop ? '60rem' : '32.8rem'}
            has_close_icon={false}
        >
            <Modal.Body className={'wallets-introducing-eu-modal__body'}>
                {!is_desktop && (
                    <div className='wallets-introducing-eu-modal__icon'>
                        <Icon icon='IcAppstoreIntroducingWalletsEuCoinsResponsive' height={74} width={190} />
                    </div>
                )}
                <div className='wallets-introducing-eu-modal__content'>
                    <Text as='p' align={is_desktop ? 'start' : 'center'} size={is_desktop ? 'm' : 's'} weight='bold'>
                        <Localize i18n_default_text='Introducing Wallets' />
                    </Text>
                    <Text as='p' align={is_desktop ? 'start' : 'center'} size={is_desktop ? 's' : 'xxs'}>
                        <Localize i18n_default_text='Take control of your funds management with Wallet! Enjoy fast and secure transactions with funds segregation.' />
                    </Text>
                </div>
                <Button
                    wrapperClassName='wallets-introducing-eu-modal__button'
                    classNameSpan='wallets-introducing-eu-modal__button-text'
                    large={is_desktop}
                    onClick={onClickHandler}
                    primary
                    text={localize('Enable now')}
                />
                {is_desktop && (
                    <div className='wallets-introducing-eu-modal__icon'>
                        <Icon icon='IcAppstoreIntroducingWalletsEuCoinsDesktop' height={220} width={320} />
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
});

export default WalletsIntroducingEuModal;
