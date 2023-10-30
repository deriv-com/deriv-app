import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Jurisdiction, MT5_ACCOUNT_STATUS, getMT5AccountTitle } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TOpenPositionsSVGModal = {
    loginId: string;
    market_type: string;
    status: string;
    is_modal_open: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenPositionsSVGModal = ({
    loginId,
    market_type,
    status,
    is_modal_open,
    setModalOpen,
}: TOpenPositionsSVGModal) => {
    const {
        modules: { cfd },
    } = useStore();
    const { migrated_mt5_accounts } = cfd;
    const eligible_account = migrated_mt5_accounts?.filter(account => account?.loginId === loginId);
    const eligible_account_to_migrate_label = Object.values(eligible_account[0]?.to_account ?? {})?.[0];

    const is_migrated_with_position = status === MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION;

    const onClick = () => {
        setModalOpen(false);
    };
    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => setModalOpen(is_modal_open => !is_modal_open)}
            small
            has_close_icon={false}
        >
            <Modal.Body>
                <Text as='h1' color='prominent' weight='bold' className='open-positions-svg__modal-title'>
                    {is_migrated_with_position ? (
                        <Localize i18n_default_text='No new positions' />
                    ) : (
                        <Localize i18n_default_text='Account closed' />
                    )}
                </Text>
                <Text as='p' color='prominent ' size='xs'>
                    {is_migrated_with_position ? (
                        <Localize
                            i18n_default_text='You can no longer open new positions with your {{from_account}} account. Please use your {{to_account}} account to open new positions.'
                            values={{
                                from_account: getMT5AccountTitle({
                                    account_type: market_type,
                                    jurisdiction: Jurisdiction.SVG,
                                }),
                                to_account: getMT5AccountTitle({
                                    account_type: market_type,
                                    jurisdiction: eligible_account_to_migrate_label,
                                }),
                            }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Your {{from_account}} account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived.'
                            values={{
                                from_account: getMT5AccountTitle({
                                    account_type: market_type,
                                    jurisdiction: Jurisdiction.SVG,
                                }),
                            }}
                        />
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer className='open-positions-svg__modal-footer'>
                <Button has_effect onClick={onClick} secondary large>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OpenPositionsSVGModal;
