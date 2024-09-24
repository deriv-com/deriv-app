import React, { Suspense } from 'react';
import { useDevice } from '@deriv-com/ui';
import { DerivLightUploadPoiIcon, DerivLightWaitingPoaIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { Text, Modal, UILoader, MobileDialog } from '@deriv/components';
import { routes, CFD_PLATFORMS, AUTH_STATUS_CODES, CFD_text } from '@deriv/shared';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import ListItem from './ListItem';
import './verification-docs-list-modal.scss';

type TItems = {
    id: string;
    text: string;
    status: string | number;
    route: string;
};

const getIcon = (items: TItems[]) => {
    const icon_size = { height: '120px', width: '120px' };
    if (items.every(item => item?.id === 'address' && item?.status === AUTH_STATUS_CODES.PENDING)) {
        return <DerivLightWaitingPoaIcon {...icon_size} />;
    }
    return <DerivLightUploadPoiIcon {...icon_size} />;
};

const VerificationDocsListModalContent = observer(() => {
    const {
        modules: { cfd },
        common: { platform },
    } = useStore();
    const { mt5_companies, account_type } = cfd;
    const { isMobile } = useDevice();
    const { client_kyc_status } = useGetStatus();
    const { is_selected_MT5_account_created } = useIsSelectedMT5AccountCreated();
    if (!client_kyc_status) return null;
    const { poi_status, poa_status, valid_tin } = client_kyc_status;

    const items: TItems[] = [
        poi_status && {
            id: 'identity',
            text: 'Proof of identity',
            status: poi_status,
            route: routes.proof_of_identity,
        },
        poa_status && {
            id: 'address',
            text: 'Proof of address',
            status: poa_status,
            route: routes.proof_of_address,
        },
        valid_tin === 0 && {
            id: 'tax',
            text: 'Personal Details',
            status: valid_tin,
            route: routes.personal_details,
        },
    ].filter(Boolean) as TItems[];
    return (
        <div className='verification-docs-list-modal__content'>
            {getIcon(items)}
            <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl' align='center'>
                {platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created ? (
                    <Localize
                        i18n_default_text='Once your account details are complete, your {{platform}} {{product}} account will be ready for you.'
                        values={{
                            platform: CFD_text[platform],
                            product: mt5_companies[account_type.category][account_type.type]?.title || '',
                        }}
                    />
                ) : (
                    <Localize i18n_default_text='Your account needs verification.' />
                )}
            </Text>
            <div className='verification-docs-list-modal__content-list'>
                {items.map(item => (
                    <ListItem key={item.id} id={item.id} text={item.text} status={item.status} route={item.route} />
                ))}
            </div>
        </div>
    );
});

const VerificationDocsListModal = observer(() => {
    const { traders_hub, common } = useStore();
    const { is_verification_docs_list_modal_visible, setVerificationModalOpen } = traders_hub;
    const { platform } = common;
    const { is_selected_MT5_account_created } = useIsSelectedMT5AccountCreated();
    const { isMobile } = useDevice();
    const title =
        platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created
            ? localize('Create account')
            : localize('Verify your account');
    return (
        <Suspense fallback={<UILoader />}>
            {!isMobile ? (
                <Modal
                    is_open={is_verification_docs_list_modal_visible}
                    toggleModal={() => setVerificationModalOpen(false)}
                    title={title}
                    width='44rem'
                    should_header_stick_body={false}
                    has_close_icon
                >
                    <VerificationDocsListModalContent />
                </Modal>
            ) : (
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={title}
                    visible={is_verification_docs_list_modal_visible}
                    onClose={() => setVerificationModalOpen(false)}
                >
                    <VerificationDocsListModalContent />
                </MobileDialog>
            )}
        </Suspense>
    );
});

export default VerificationDocsListModal;