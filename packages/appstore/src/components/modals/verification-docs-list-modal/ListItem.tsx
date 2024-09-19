import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv/translations';
import { Text, StatusBadge } from '@deriv/components';
import { AUTH_STATUS_CODES } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import './verification-docs-list-modal.scss';
import { LabelPairedChevronRightCaptionBoldIcon } from '@deriv/quill-icons';

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
        case AUTH_STATUS_CODES.REJECTED:
        case AUTH_STATUS_CODES.SUSPECTED:
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
            <Text as='div' size={isMobile ? 'xxs' : 'xs'} line_height='xl'>
                <Localize i18n_default_text={text} />
            </Text>
            {status === AUTH_STATUS_CODES.NONE || (id === 'tax' && status === 0) ? (
                <LabelPairedChevronRightCaptionBoldIcon />
            ) : (
                <div className='verification-docs-list-modal__card'>
                    <StatusBadge account_status={status} icon={badge_icon} text={badge_text} icon_size={badge_size} />
                    <LabelPairedChevronRightCaptionBoldIcon fill='var(--text-primary)' />
                </div>
            )}
        </div>
    );
});

export default ListItem;
