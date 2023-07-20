import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Icon, Text, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getMT5Title } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import DynamicLeverageModalContent from '../dynamic-leverage/dynamic-leverage-modal-content';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';

const JurisdictionModal = observer(({ openPasswordModal }: TJurisdictionModalProps) => {
    const { traders_hub, ui } = useStore();

    const { show_eu_related_content } = traders_hub;
    const { disableApp, enableApp } = ui;

    const { account_type, is_jurisdiction_modal_visible, toggleJurisdictionModal } = useCfdStore();

    const [is_dynamic_leverage_visible, setIsDynamicLeverageVisible] = React.useState(false);

    const toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement> = event => {
        event.stopPropagation();
        setIsDynamicLeverageVisible(!is_dynamic_leverage_visible);
    };

    let modal_title;
    if (is_dynamic_leverage_visible) {
        modal_title = (
            <div className='jurisdiction-modal__title'>
                <span
                    data-testid='back_icon'
                    className='jurisdiction-modal__title-back'
                    onClick={toggleDynamicLeverage}
                >
                    <Icon icon='IcArrowLeftBold' />
                </span>
                <Text weight='bold' color='prominent'>
                    {localize('Get more out of Deriv MT5 Financial')}
                </Text>
            </div>
        );
    } else if (show_eu_related_content) {
        modal_title = localize('Choose a jurisdiction for your Deriv MT5 CFDs account');
    } else {
        modal_title = localize('Choose a jurisdiction for your Deriv MT5 {{account_type}} account', {
            account_type: localize(getMT5Title(account_type.type)),
        });
    }

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='jurisdiction-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        is_open={is_jurisdiction_modal_visible}
                        title={modal_title}
                        toggleModal={toggleJurisdictionModal}
                        type='button'
                        width={account_type.type === 'financial' ? '1200px' : '1040px'}
                        has_close_icon={!is_dynamic_leverage_visible}
                    >
                        <div
                            className={classNames('jurisdiction-modal__wrapper', {
                                'jurisdiction-modal__flipped': is_dynamic_leverage_visible,
                            })}
                        >
                            <JurisdictionModalContentWrapper
                                toggleDynamicLeverage={toggleDynamicLeverage}
                                openPasswordModal={openPasswordModal}
                            />
                            <DynamicLeverageModalContent />
                        </div>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={modal_title}
                        visible={is_jurisdiction_modal_visible}
                        onClose={toggleJurisdictionModal}
                        has_close_icon={!is_dynamic_leverage_visible}
                    >
                        <div
                            className={classNames('jurisdiction-modal__wrapper', {
                                'jurisdiction-modal__flipped': is_dynamic_leverage_visible,
                            })}
                        >
                            <JurisdictionModalContentWrapper
                                toggleDynamicLeverage={toggleDynamicLeverage}
                                openPasswordModal={openPasswordModal}
                            />
                            <DynamicLeverageModalContent />
                        </div>
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
});

export default JurisdictionModal;
