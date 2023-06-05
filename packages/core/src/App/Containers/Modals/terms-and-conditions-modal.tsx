import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import React from 'react';
import 'Sass/app/modules/terms-and-conditions-modal.scss';

type TermsAndConditionsModalProps = {
    is_tnc_modal_open: boolean;
    setIsTnCModalOpen: (is_open: boolean) => void;
};

const TermsAndConditionsModal = ({ is_tnc_modal_open, setIsTnCModalOpen }: TermsAndConditionsModalProps) => {
    const [is_tnc_accepted, setIsTnCAccepted] = React.useState(false);

    return (
        <Modal
            is_open={is_tnc_modal_open}
            small
            title={localize('Acceptance of terms and conditions')}
            has_close_icon={false}
            className='tnc-acceptance'
        >
            <Modal.Body className='tnc-acceptance__body'>
                <Text as='p' size='xs'>
                    <Localize i18n_default_text='We have updated our terms and conditions. Please note that we reserve the right to modify or change our terms and conditions at any time without prior notice.' />
                </Text>
                <Checkbox
                    id='tnc_acceptance'
                    label={
                        <Localize
                            i18n_default_text='I have read and agree to the <0>terms and conditions</0>.'
                            components={[
                                <a
                                    key={0}
                                    className='link link--normal'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href='https://www.gamstop.co.uk'
                                />,
                            ]}
                        />
                    }
                    onChange={() => setIsTnCAccepted(!is_tnc_accepted)}
                    className='tnc-acceptance__checkbox'
                    defaultChecked={is_tnc_accepted}
                />
            </Modal.Body>
            <Modal.Footer has_separator>
                <Button type='button' onClick={() => setIsTnCModalOpen(false)} disabled={!is_tnc_accepted} primary>
                    {localize('Continue')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default connect(({ ui }: RootStore) => ({
    is_tnc_modal_open: ui.is_tnc_modal_open,
    setIsTnCModalOpen: ui.setIsTnCModalOpen,
}))(TermsAndConditionsModal);
