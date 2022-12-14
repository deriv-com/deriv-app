import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores/index';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';

const ModalContent = () => {
    return (
        <div className='account-type-card__wrapper'>
            <div className='account-type-card'>
                <div className='account-type-card__image'>
                    <TradigPlatformIconProps icon='Derived' size={64} />
                </div>
                <div className='account-type-card__header'>
                    <Text as='h2' weight='bold'>
                        {localize(`Derived`)}
                    </Text>
                </div>
                <div className='account-type-card__description'>Description</div>
            </div>
            <div className='account-type-card'>
                <div className='account-type-card__image'>
                    <TradigPlatformIconProps icon='Financial' size={64} />
                </div>
                <div className='account-type-card__header'>
                    <Text as='h2' weight='bold'>
                        {localize(`Financial`)}
                    </Text>
                </div>
                <div className='account-type-card__description'>Description</div>
            </div>
        </div>
    );
};

const AccountTypeModal = () => {
    const { tradinghub, ui } = useStores();
    const { is_account_type_modal_visible, toggleAccountTypeModalVisibility } = tradinghub;
    const { enableApp, disableApp } = ui;
    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='account-type-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        // is_open={is_account_type_modal_visible}
                        is_open={true}
                        title={`Select Deriv MT5's account type`}
                        toggleModal={toggleAccountTypeModalVisibility}
                        type='button'
                        height='664px'
                        width={'1200px'}
                    >
                        <ModalContent />
                        <Modal.Footer has_separator>
                            <Button
                                disabled={false}
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
                        <ModalContent />
                        <Modal.Footer has_separator>
                            <Button
                                disabled={false}
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
export default AccountTypeModal;
