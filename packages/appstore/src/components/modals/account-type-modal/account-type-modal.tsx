import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useStores } from 'Stores/index';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { TModalContent, TAccountCard, TTradingPlatformAvailableAccount } from './types';
import { TIconTypes } from 'Types';
import { CFD_PLATFORMS } from '@deriv/shared';
import { derived_account, financial_account, swapfree_account } from '../../../helpers/account-helper';

const AccountCard = ({ selectAccountTypeCard, account_type_card, title_and_type, description, icon }: TAccountCard) => {
    const cardSelection = (cardType: string) => {
        selectAccountTypeCard(account_type_card === cardType ? '' : cardType);
    };
    return (
        <div
            className={classNames('account-type-card', {
                'account-type-card--selected': account_type_card === title_and_type,
            })}
            onClick={() => cardSelection(title_and_type)}
        >
            <div className='account-type-card__image'>
                <TradigPlatformIconProps icon={icon as TIconTypes} size={64} />
            </div>
            <div className='account-type-card__header'>
                <Text as='h2' weight='bold'>
                    {title_and_type}
                </Text>
            </div>
            <div className='account-type-card__description'>
                <Text as='p' size='xxs' align='center'>
                    {description}
                </Text>
            </div>
        </div>
    );
};

const ModalContent = ({
    account_type_card,
    selectAccountTypeCard,
    is_financial_available,
    is_synthetic_available,
    is_swapfree_available,
}: TModalContent) => {
    return (
        <div className='account-type-card__wrapper'>
            {is_synthetic_available && (
                <AccountCard
                    account_type_card={account_type_card}
                    selectAccountTypeCard={() => selectAccountTypeCard(`${derived_account.title_and_type}`)}
                    description={derived_account.description}
                    title_and_type={derived_account.title_and_type}
                    icon={derived_account.icon}
                />
            )}
            {is_financial_available && (
                <AccountCard
                    account_type_card={account_type_card}
                    selectAccountTypeCard={() => selectAccountTypeCard(`${financial_account.title_and_type}`)}
                    description={financial_account.description}
                    title_and_type={financial_account.title_and_type}
                    icon={financial_account.icon}
                />
            )}
            {is_swapfree_available && (
                <AccountCard
                    account_type_card={account_type_card}
                    selectAccountTypeCard={() => selectAccountTypeCard(`${swapfree_account.title_and_type}`)}
                    description={swapfree_account.description}
                    title_and_type={swapfree_account.title_and_type}
                    icon={swapfree_account.icon}
                />
            )}
        </div>
    );
};

const MT5AccountTypeModal = () => {
    const { traders_hub, ui, client, modules, common } = useStores();
    const {
        is_account_type_modal_visible,
        toggleAccountTypeModalVisibility,
        account_type_card,
        selectAccountTypeCard,
        getAccount,
    } = traders_hub;
    const { setAccountType } = modules.cfd;
    const { trading_platform_available_accounts } = client;
    const { enableApp, disableApp } = ui;
    const { setAppstorePlatform } = common;

    React.useEffect(() => {
        if (!is_account_type_modal_visible) {
            selectAccountTypeCard('');
        }
    }, [is_account_type_modal_visible, selectAccountTypeCard]);

    const is_financial_available = trading_platform_available_accounts.some(
        (available_account: TTradingPlatformAvailableAccount) => available_account.market_type === 'financial'
    );

    const is_synthetic_available = trading_platform_available_accounts.some(
        (available_account: TTradingPlatformAvailableAccount) => available_account.market_type === 'gaming'
    );
    const is_swapfree_available = trading_platform_available_accounts.some(
        (available_account: TTradingPlatformAvailableAccount) => available_account.market_type === 'all'
    );

    const set_account_type = () => {
        switch (account_type_card) {
            case 'Derived':
                setAccountType({ category: 'real', type: 'synthetic' });
                break;
            case 'Swap-Free':
                setAccountType({ category: 'real', type: 'all' });
                break;
            case 'Financial':
            default:
                setAccountType({ category: 'real', type: 'financial' });
                break;
        }
    };

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
                        title={localize("Select Deriv MT5's account type")}
                        toggleModal={toggleAccountTypeModalVisibility}
                        type='button'
                        height='664px'
                        width={'1200px'}
                    >
                        <ModalContent
                            account_type_card={account_type_card}
                            selectAccountTypeCard={selectAccountTypeCard}
                            is_financial_available={is_financial_available}
                            is_synthetic_available={is_synthetic_available}
                            is_swapfree_available={is_swapfree_available}
                        />
                        <Modal.Footer has_separator>
                            <Button
                                disabled={!account_type_card}
                                primary
                                onClick={() => {
                                    set_account_type();
                                    toggleAccountTypeModalVisibility();
                                    setAppstorePlatform(CFD_PLATFORMS.MT5);
                                    getAccount();
                                }}
                            >
                                {localize('Next')}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={localize("Select Deriv MT5's account type")}
                        visible={is_account_type_modal_visible}
                        onClose={toggleAccountTypeModalVisibility}
                    >
                        <ModalContent
                            account_type_card={account_type_card}
                            selectAccountTypeCard={selectAccountTypeCard}
                            is_financial_available={is_financial_available}
                            is_synthetic_available={is_synthetic_available}
                            is_swapfree_available={is_swapfree_available}
                        />
                        <Modal.Footer has_separator>
                            <Button
                                style={{ width: '100%' }}
                                disabled={!account_type_card}
                                primary
                                onClick={() => {
                                    set_account_type();
                                    toggleAccountTypeModalVisibility();
                                    setAppstorePlatform(CFD_PLATFORMS.MT5);
                                    getAccount();
                                }}
                            >
                                {localize('Next')}
                            </Button>
                        </Modal.Footer>
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};
export default observer(MT5AccountTypeModal);
