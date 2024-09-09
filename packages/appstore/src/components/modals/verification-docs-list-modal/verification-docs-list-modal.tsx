import React, { memo } from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { Text, Modal } from '@deriv/components';
import { AUTH_STATUS_CODES, ACCOUNT_BADGE_STATUS, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import './verification-docs-list-modal.scss';
import {
    DerivLightUploadPoiIcon,
    DerivLightWaitingPoiIcon,
    LabelPairedChevronRightCaptionBoldIcon,
    DerivLightDeclinedPoiIcon,
} from '@deriv/quill-icons';

type TAccountBadgeStatus = typeof ACCOUNT_BADGE_STATUS[keyof typeof ACCOUNT_BADGE_STATUS] | null;

type TListItemProps = {
    id: string;
    text: string;
    status: string | number;
    route: string;
};

const iconsMap = {
    [ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION]: DerivLightUploadPoiIcon,
    [ACCOUNT_BADGE_STATUS.PENDING]: DerivLightWaitingPoiIcon,
    [ACCOUNT_BADGE_STATUS.FAILED]: DerivLightDeclinedPoiIcon,
};

const ListItem = observer(({ id, text, status, route }: TListItemProps) => {
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
            <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl'>
                <Localize i18n_default_text={text} />
            </Text>
            {status === AUTH_STATUS_CODES.NONE || (id === 'tax' && status === 0) ? (
                <LabelPairedChevronRightCaptionBoldIcon />
            ) : (
                <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl'>
                    <Localize i18n_default_text={status} />
                </Text>
            )}
        </div>
    );
});

const BadgeIcon = memo(({ status_badge }: { status_badge: TAccountBadgeStatus }) => {
    const IconComponent = iconsMap[status_badge];
    return IconComponent ? <IconComponent height={120} width={120} /> : null;
});

BadgeIcon.displayName = 'BadgeIcon';

const VerificationDocsListModal = observer(() => {
    const {
        traders_hub,
        modules: { cfd },
    } = useStore();
    const { is_verification_docs_list_modal_visible, toggleVerificationModal } = traders_hub;
    const { mt5_companies, account_type } = cfd;
    const { isMobile } = useDevice();
    const { status_badge, client_kyc_status } = useGetStatus();
    const current_account = useIsSelectedMT5AccountCreated();
    const { poi_status, poa_status, valid_tin } = client_kyc_status;

    const items = [
        { id: 'identity', text: 'Proof of identity', status: poi_status, route: routes.proof_of_identity },
        { id: 'address', text: 'Proof of address', status: poa_status, route: routes.proof_of_address },
        { id: 'tax', text: 'Tax residence', status: valid_tin, route: routes.personal_details },
    ].filter(item => item.status || item.status === 0);

    return (
        <Modal
            is_open={is_verification_docs_list_modal_visible}
            toggleModal={() => toggleVerificationModal(false)}
            title={localize('Verify your account')}
            width='44rem'
            should_header_stick_body={false}
            has_close_icon
        >
            <div className='verification-docs-list-modal__content'>
                <BadgeIcon status_badge={status_badge} />
                <Text size={isMobile ? 'xxs' : 'xs'} line_height='xl' align='center'>
                    {current_account && Object.keys(current_account).length ? (
                        <Localize i18n_default_text='Your account needs verification.' />
                    ) : (
                        <Localize
                            i18n_default_text='Once your account details are complete, your {{platform}} {{product}} account will be ready for you.'
                            values={{
                                platform: 'MT5',
                                product: mt5_companies[account_type.category][account_type.type]?.title || '',
                            }}
                        />
                    )}
                </Text>
                <div className='verification-docs-list-modal__content-list'>
                    {items.map(item => (
                        <ListItem key={item.id} id={item.id} text={item.text} status={item.status} route={item.route} />
                    ))}
                </div>
            </div>
        </Modal>
    );
});

export default VerificationDocsListModal;
