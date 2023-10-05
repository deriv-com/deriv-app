import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import {
    CFD_PLATFORMS,
    getCFDPlatformLabel,
    getFormattedJurisdictionCode,
    getFormattedJurisdictionMarketTypes,
    Jurisdiction,
    JURISDICTION_MARKET_TYPES,
} from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TOpenPositionsSVGModal = {
    market_type: string;
    open_order_position_status: boolean | undefined;
    is_modal_open: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenPositionsSVGModal = ({
    market_type,
    open_order_position_status,
    is_modal_open,
    setModalOpen,
}: TOpenPositionsSVGModal) => {
    const { eligible_account_to_migrate_label } = useMT5SVGEligibleToMigrate();
    const title = open_order_position_status ? 'No new positions' : 'Account closed';
    const account_type =
        market_type === JURISDICTION_MARKET_TYPES.FINANCIAL
            ? getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.FINANCIAL)
            : getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.DERIVED);
    const from_account = getFormattedJurisdictionCode(Jurisdiction.SVG);
    const cfd_platform = getCFDPlatformLabel(CFD_PLATFORMS.MT5);

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
                    <Localize i18n_default_text='{{title}}' values={{ title }} />
                </Text>
                <Text as='p' color='prominent ' size='xs'>
                    {open_order_position_status ? (
                        <Localize
                            i18n_default_text='You can no longer open new positions with your {{cfd_platform}} {{account_type}} {{from_account}} account. Please use your {{cfd_platform}} {{account_type}} {{eligible_account_to_migrate_label}} account to open new positions.'
                            values={{ account_type, from_account, eligible_account_to_migrate_label, cfd_platform }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Your {{cfd_platform}} {{account_type}} {{from_account}} account will be archived after 30 days of inactivity. You can still access your trade history until the account is archived.'
                            values={{ account_type, from_account, cfd_platform }}
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
