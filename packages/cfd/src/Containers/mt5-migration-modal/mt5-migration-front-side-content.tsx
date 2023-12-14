import React from 'react';
import { Button, Modal, Text, HintBox } from '@deriv/components';
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
            <div className='mt5-migration-modal__migration_infobox'>
                <HintBox
                    icon='IcInfoBlue'
                    message={
                        <Text as='p' size='xxxs'>
                            <Localize
                                i18n_default_text='Your existing <0>MT5 SVG</0> account(s) will remain accessible.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    }
                    is_info
                />
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
