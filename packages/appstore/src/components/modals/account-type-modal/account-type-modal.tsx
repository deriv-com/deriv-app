import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useStores } from 'Stores/index';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';

type TModalContent = {
    account_type_card: string;
    selectAccountTypeCard: React.Dispatch<React.SetStateAction<string>>;
};

const ModalContent = ({ account_type_card, selectAccountTypeCard }: TModalContent) => {
    const cardSelection = (cardType: string) => {
        selectAccountTypeCard(account_type_card === cardType ? '' : cardType);
    };
    return (
        <div className='account-type-card__wrapper'>
            <div
                className={classNames('account-type-card', {
                    'account-type-card--selected': account_type_card === 'Derived',
                })}
                onClick={() => cardSelection('Derived')}
            >
                <div className='account-type-card__image'>
                    <TradigPlatformIconProps icon='Derived' size={64} />
                </div>
                <div className='account-type-card__header'>
                    <Text as='h2' weight='bold'>
                        {localize(`Derived`)}
                    </Text>
                </div>
                <div className='account-type-card__description'>
                    <Text as='p' size='xxs' align='center'>
                        {localize(`Trade CFDs on MT5 with Derived indices that simulate real-world market movements.`)}
                    </Text>
                </div>
            </div>
            <div
                className={classNames('account-type-card', {
                    'account-type-card--selected': account_type_card === 'Financial',
                })}
                onClick={() => cardSelection('Financial')}
            >
                <div className='account-type-card__image'>
                    <TradigPlatformIconProps icon='Financial' size={64} />
                </div>
                <div className='account-type-card__header'>
                    <Text as='h2' weight='bold'>
                        {localize(`Financial`)}
                    </Text>
                </div>
                <div className='account-type-card__description'>
                    <Text as='p' size='xxs' align='center'>
                        {localize(`Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.`)}
                    </Text>
                </div>
            </div>
        </div>
    );
};

const AccountTypeModal = () => {
    const { tradinghub, ui } = useStores();
    const {
        is_account_type_modal_visible,
        toggleAccountTypeModalVisibility,
        account_type_card,
        selectAccountTypeCard,
    } = tradinghub;
    const { enableApp, disableApp } = ui;
    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='account-type-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='account-type--custom-exit'
                        is_open={is_account_type_modal_visible}
                        title={`Select Deriv MT5's account type`}
                        toggleModal={toggleAccountTypeModalVisibility}
                        type='button'
                        height='664px'
                        width={'1200px'}
                    >
                        <ModalContent
                            account_type_card={account_type_card}
                            selectAccountTypeCard={selectAccountTypeCard}
                        />
                        <Modal.Footer has_separator>
                            <Button
                                disabled={!account_type_card}
                                primary
                                // onClick={() => {}}
                            >
                                {localize(`Next`)}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={`Select Deriv MT5's account type`}
                        visible={is_account_type_modal_visible}
                        onClose={toggleAccountTypeModalVisibility}
                    >
                        <ModalContent
                            account_type_card={account_type_card}
                            selectAccountTypeCard={selectAccountTypeCard}
                        />
                        <Modal.Footer has_separator>
                            <Button
                                disabled={!account_type_card}
                                primary
                                // onClick={() => {}}
                            >
                                {localize(`Next`)}
                            </Button>
                        </Modal.Footer>
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};
export default observer(AccountTypeModal);
