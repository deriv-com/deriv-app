import React, { Suspense } from 'react';

import { Icon, MobileDialog, Modal, Text, UILoader } from '@deriv/components';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import { ACCOUNTS_OS_POI_URL, CFD_PLATFORMS, getAppId, getSocketURL, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import ListItem from './ListItem';

import './verification-docs-list-modal.scss';

type TItems = {
    id: string;
    text: string;
    status: string | number;
    route: string;
};

const VerificationDocsListModalContent = observer(() => {
    const {
        common: { platform },
        client: { getToken },
    } = useStore();

    const getFormattedURL = (url_link: string) => {
        const url = new URL(url_link);
        const token = getToken();
        const appID = getAppId();
        const server = getSocketURL();
        url.searchParams.append('platform', 'deriv_app');
        url.searchParams.append('appid', appID);
        url.searchParams.append('lang', 'en');
        url.searchParams.append('server', server);
        url.searchParams.append('token', token);
        return url.toString();
    };

    const { isMobile } = useDevice();
    const { client_kyc_status } = useGetStatus();
    const { is_selected_MT5_account_created } = useIsSelectedMT5AccountCreated();
    if (!client_kyc_status) return null;
    const { poi_status, poa_status, valid_tin, required_tin } = client_kyc_status;
    const is_tin_required = required_tin === 1 && valid_tin === 0;

    const items: TItems[] = [
        poi_status && {
            id: 'identity',
            text: 'Proof of identity',
            status: poi_status,
            route: getFormattedURL(ACCOUNTS_OS_POI_URL),
        },
        poa_status && {
            id: 'address',
            text: 'Proof of address',
            status: poa_status,
            route: routes.proof_of_address,
        },
        is_tin_required && {
            id: 'tax',
            text: 'Additional information',
            status: valid_tin,
            route: routes.personal_details,
        },
    ].filter(Boolean) as TItems[];

    return (
        <div className='verification-docs-list-modal__content'>
            <Icon icon='IcDerivLightUserVerification' size={128} />
            <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl' align='center'>
                {platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created ? (
                    <Localize i18n_default_text='Confirm your details to open the account. After verification, you can begin trading.' />
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
    const getTitle = () =>
        platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created ? (
            <Localize i18n_default_text='Complete your profile' />
        ) : (
            <Localize i18n_default_text='Verification required' />
        );
    return (
        <Suspense fallback={<UILoader />}>
            {!isMobile ? (
                <Modal
                    is_open={is_verification_docs_list_modal_visible}
                    toggleModal={() => setVerificationModalOpen(false)}
                    title={getTitle()}
                    width='44rem'
                    should_header_stick_body={false}
                    has_close_icon
                >
                    <VerificationDocsListModalContent />
                </Modal>
            ) : (
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={getTitle()}
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
