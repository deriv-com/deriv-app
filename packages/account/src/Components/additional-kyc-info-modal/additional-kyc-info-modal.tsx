import React from 'react';
import { observer, useStore } from '@deriv/stores';
import {
    Modal,
    DesktopWrapper,
    MobileWrapper,
    UILoader,
    PageOverlay,
    Div100vhContainer,
    HintBox,
    Text,
} from '@deriv/components';
import { Localize } from '@deriv/translations';
import AdditionalKycInfoForm from './additional-kyc-info-form';

export const AdditionalKycInfoModal = observer(() => {
    const {
        ui: { is_additional_kyc_info_modal_open: is_open, toggleAdditionalKycInfoModal },
    } = useStore();
    const [error, setError] = React.useState('');

    const toggleModal = (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        // if e.target is anchor tag, don't close modal for link click within modal
        const target = e?.target as HTMLElement;
        if (target.tagName === 'A') e?.stopPropagation();
        toggleAdditionalKycInfoModal();
    };
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
                        toggleModal={toggleModal}
                        className='additinal-kyc-info'
                        width='90.4rem'
                        height={error ? '52.8rem' : '49.6rem'}
                    >
                        <Modal.Body className='additional-kyc-info-modal__form'>
                            {error && (
                                <HintBox
                                    className='additional-kyc-info-modal__hintbox'
                                    icon='IcAlertDanger'
                                    icon_height={16}
                                    icon_width={16}
                                    message={
                                        <Text as='p' size='xxxs'>
                                            {error}
                                        </Text>
                                    }
                                    is_danger
                                />
                            )}
                            <AdditionalKycInfoForm setError={setError} />
                        </Modal.Body>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open
                        portal_id='deriv_app'
                        header={
                            <Localize i18n_default_text='Additional information required for Deriv MT5 account(s)' />
                        }
                        onClickClose={toggleAdditionalKycInfoModal}
                        header_classname='additional-kyc-info-modal__portal-header'
                    >
                        <Div100vhContainer className='additional-kyc-info-modal__form' height_offset='100px'>
                            {error && (
                                <HintBox
                                    className='additional-kyc-info-modal__hintbox'
                                    icon='IcAlertDanger'
                                    icon_height={16}
                                    icon_width={16}
                                    message={
                                        <Text as='p' size='xxxs'>
                                            {error}
                                        </Text>
                                    }
                                    is_danger
                                />
                            )}
                            <AdditionalKycInfoForm setError={setError} />
                        </Div100vhContainer>
                    </PageOverlay>
                </MobileWrapper>
            </div>
        </React.Suspense>
    );
});

AdditionalKycInfoModal.displayName = 'AdditionalKycInfoModal';
