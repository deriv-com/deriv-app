import React, { Suspense } from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { Text, Modal, UILoader, MobileDialog, StatusBadge } from '@deriv/components';
import { AUTH_STATUS_CODES, routes, CFD_PLATFORMS } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import './verification-docs-list-modal.scss';
import { DerivLightUploadPoiIcon, LabelPairedChevronRightCaptionBoldIcon } from '@deriv/quill-icons';

type TListItemProps = {
    id: string;
    text: string;
    status: string | number;
    route: string;
};

type TAuthStatusCodes = typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES];

const MT5BadgeStatus = (status: TAuthStatusCodes) => {
    switch (status) {
        case AUTH_STATUS_CODES.VERIFIED:
            return {
                text: <Localize i18n_default_text='Verified' />,
                icon: 'IcMt5Success',
                icon_size: '18',
            };
        case AUTH_STATUS_CODES.PENDING:
            return {
                text: <Localize i18n_default_text='In review' />,
                icon: 'IcMt5Pending',
            };
        case AUTH_STATUS_CODES.REJECTED && AUTH_STATUS_CODES.SUSPENDED:
            return {
                text: <Localize i18n_default_text='Failed' />,
                icon: 'IcMt5Failed',
                icon_size: '18',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

const ListItem = observer(({ id, text, status, route }: TListItemProps) => {
    const { text: badge_text, icon: badge_icon, icon_size: badge_size } = MT5BadgeStatus(status);
    const { isMobile } = useDevice();
    const { traders_hub } = useStore();
    const { toggleVerificationModal } = traders_hub;
    const history = useHistory();

    const onClickItem = () => {
        history.push(route);
        toggleVerificationModal(false);
    };

    return (
        <div className='verification-docs-list-modal__content-list-item' onClick={onClickItem}>
            <div>
                <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl'>
                    <Localize i18n_default_text={text} />
                </Text>
            </div>
            {status === AUTH_STATUS_CODES.NONE || (id === 'tax' && status === 0) ? (
                <LabelPairedChevronRightCaptionBoldIcon />
            ) : (
                <div className='verification-docs-list-modal__card'>
                    <StatusBadge account_status={status} icon={badge_icon} text={badge_text} icon_size={badge_size} />
                    <LabelPairedChevronRightCaptionBoldIcon fill='#c7c7c7' />
                </div>
            )}
        </div>
    );
});

const VerificationDocsListModalContent = observer(() => {
    const {
        modules: { cfd },
        common: { platform },
    } = useStore();
    const { mt5_companies, account_type } = cfd;
    const { isMobile } = useDevice();
    const { client_kyc_status } = useGetStatus();
    const { is_selected_MT5_account_created } = useIsSelectedMT5AccountCreated();
    const { poi_status, poa_status, valid_tin } = client_kyc_status;

    const items = [
        { id: 'identity', text: 'Proof of identity', status: poi_status, route: routes.proof_of_identity },
        { id: 'address', text: 'Proof of address', status: poa_status, route: routes.proof_of_address },
        { id: 'tax', text: 'Tax residence', status: valid_tin, route: routes.personal_details },
    ].filter(item => item.status || item.status === 0);

    return (
        <div className='verification-docs-list-modal__content'>
            <DerivLightUploadPoiIcon height={120} width={120} />
            <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl' align='center'>
                {platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created ? (
                    <Localize
                        i18n_default_text='Once your account details are complete, your {{platform}} {{product}} account will be ready for you.'
                        values={{
                            platform: 'MT5',
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
    const { is_verification_docs_list_modal_visible, toggleVerificationModal } = traders_hub;
    const { platform } = common;
    const { is_selected_MT5_account_created } = useIsSelectedMT5AccountCreated();
    const { isDesktop } = useDevice();
    const title =
        platform === CFD_PLATFORMS.MT5 && !is_selected_MT5_account_created
            ? localize('Create account')
            : localize('Verify your account');

    return (
        <Suspense fallback={<UILoader />}>
            {isDesktop ? (
                <Modal
                    is_open={is_verification_docs_list_modal_visible}
                    toggleModal={() => toggleVerificationModal(false)}
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
                    onClose={() => toggleVerificationModal(false)}
                >
                    <VerificationDocsListModalContent />
                </MobileDialog>
            )}
        </Suspense>
    );
});

export default VerificationDocsListModal;
