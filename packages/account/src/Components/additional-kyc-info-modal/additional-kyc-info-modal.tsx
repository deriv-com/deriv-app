import React from 'react';
import { observer, useStore } from '@deriv/stores';
import {
    Modal,
    DesktopWrapper,
    MobileWrapper,
    UILoader,
    PageOverlay,
    Div100vhContainer,
    Text,
} from '@deriv/components';
import { Localize } from '@deriv/translations';
import { AdditionalKycInfoForm } from './Form';
import './additional-kyc-info-modal.scss';

export const AdditionalKycInfoModal = observer(() => {
    const {
        ui: { is_additional_kyc_info_modal_open: is_open, toggleAdditionalKycInfoModal },
    } = useStore();

    return (
        <React.Suspense fallback={<UILoader />}>
            <div className='additional-kyc-info-modal__container'>
                <DesktopWrapper>
                    <Modal
                        has_close_icon
                        is_open={is_open}
                        title={
                            <Localize i18n_default_text='Additional information required for Deriv MT5 account(s)' />
                        }
                        toggleModal={toggleAdditionalKycInfoModal}
                        className='additinal-kyc-info'
                        width='90.4rem'
                        height='49.6rem'
                    >
                        <Modal.Body className='additional-kyc-info-modal__form'>
                            <Text
                                as='p'
                                size='s'
                                line_height='xxl'
                                align='center'
                                className='additional-kyc-info-modal__form--header'
                            >
                                <Localize i18n_default_text='Please take a moment to update your information now.' />
                            </Text>
                            <AdditionalKycInfoForm />
                        </Modal.Body>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open={is_open}
                        portal_id='deriv_app'
                        header={
                            <Localize i18n_default_text='Additional information required for Deriv MT5 account(s)' />
                        }
                        onClickClose={toggleAdditionalKycInfoModal}
                        header_classname='additional-kyc-info-modal__portal-header'
                    >
                        <Div100vhContainer className='additional-kyc-info-modal__form' height_offset='80px'>
                            <div>Form</div>
                        </Div100vhContainer>
                    </PageOverlay>
                </MobileWrapper>
            </div>
        </React.Suspense>
    );
});
