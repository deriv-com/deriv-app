import React from 'react';
import { Button, Modal, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

type TCompanyWideLimitExceededModal = {
    is_visible: boolean;
    onConfirm: () => void;
};

const CompanyWideLimitExceededModal = ({ is_visible, onConfirm }: TCompanyWideLimitExceededModal) => {
    return (
        <Modal
            is_open={is_visible}
            small
            is_vertical_centered={isMobile()}
            toggleModal={onConfirm}
            title={localize('Purchase Error')}
        >
            <Modal.Body>
                <Localize
                    i18n_default_text='No further trading is allowed on this contract type for the current trading session. For more info, refer to our <0>terms and conditions</0>.'
                    components={[<StaticUrl key={0} className='link' href='tnc/trading-terms.pdf' is_document />]}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={onConfirm} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default CompanyWideLimitExceededModal;
