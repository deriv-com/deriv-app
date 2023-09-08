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
    InlineMessage,
} from '@deriv/components';
import { Localize } from '@deriv/translations';
import AdditionalKycInfoForm from './additional-kyc-info-form';

type TAdditionalKycInfoFormWithHintBox = {
    error?: unknown;
    setError?: React.Dispatch<React.SetStateAction<unknown>>;
};

const AdditionalKycInfoFormWithHintBox = ({ error, setError }: TAdditionalKycInfoFormWithHintBox) => {
    return (
        <React.Fragment>
            {!!error && (
                <InlineMessage
                    size='sm'
                    message={
                        error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string' &&
                        error.message
                    }
                    type='error'
                />
            )}
            <AdditionalKycInfoForm setError={setError} />
        </React.Fragment>
    );
};

export const AdditionalKycInfoModal = observer(() => {
    const {
        ui: { is_additional_kyc_info_modal_open: is_open, toggleAdditionalKycInfoModal },
    } = useStore();
    const [error, setError] = React.useState<unknown>('');

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
                        className='additional-kyc-info'
                        width='90.4rem'
                        height={error ? '54.4rem' : '49.6rem'}
                    >
                        <Modal.Body className='additional-kyc-info-modal__form'>
                            <AdditionalKycInfoFormWithHintBox setError={setError} error={error} />
                        </Modal.Body>
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open
                        portal_id='deriv_app'
                        header={
                            <Text size='xs' align='left'>
                                <Localize i18n_default_text='Additional information required for Deriv MT5 account(s)' />
                            </Text>
                        }
                        onClickClose={toggleAdditionalKycInfoModal}
                        header_classname='additional-kyc-info-modal__portal-header'
                    >
                        <Div100vhContainer className='additional-kyc-info-modal__form' height_offset='100px'>
                            <AdditionalKycInfoFormWithHintBox />
                        </Div100vhContainer>
                    </PageOverlay>
                </MobileWrapper>
            </div>
        </React.Suspense>
    );
});

AdditionalKycInfoModal.displayName = 'AdditionalKycInfoModal';
