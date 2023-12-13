import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationFrontSideContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const content_size = is_mobile ? 'xs' : 's';
    const { setShowModalFrontSide } = useMT5MigrationModalContext();

    return (
        <React.Fragment>
            <div className='mt5-migration-modal__description'>
                <Text as='p' size={content_size} align='center'>
                    <Localize i18n_default_text='We are giving you a new MT5 account(s) to enhance your trading experience' />
                </Text>
            </div>
            <div className='mt5-migration-modal__migration_content'>
                <div className='mt5-migration-modal__migration_content-items'>
                    <MT5MigrationAccountIcons />
                </div>
            </div>
            <div>
                <Text as='p' size={content_size} align='center'>
                    <Localize
                        i18n_default_text='Click <0>Next</0> to start your transition.'
                        components={[<strong key={0} />]}
                    />
                </Text>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' has_effect large primary onClick={() => setShowModalFrontSide(false)}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});
export default MT5MigrationFrontSideContent;
