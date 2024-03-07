import React from 'react';
import { Button, Modal, Text, HintBox } from '@deriv/components';
import { CFD_PLATFORMS, Jurisdiction, getCFDPlatformNames } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationFrontSideContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile, setMT5MigrationModalEnabled } = ui;
    const content_size = is_mobile ? 'xxs' : 'xs';
    const { setShowModalFrontSide } = useMT5MigrationModalContext();

    const onConfirm = () => {
        setShowModalFrontSide(false);
        setMT5MigrationModalEnabled(true);
    };

    return (
        <React.Fragment>
            <div className='mt5-migration-modal__container'>
                <div className='mt5-migration-modal__description'>
                    <Text as='p' size={content_size} align='center'>
                        <Localize
                            i18n_default_text='We are giving you a new {{platform}} account(s) to enhance your trading experience'
                            values={{
                                platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                            }}
                        />
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
                                    i18n_default_text='Your existing <0>{{platform}} {{account}}</0> account(s) will remain accessible.'
                                    components={[<strong key={0} />]}
                                    values={{
                                        account: Jurisdiction.SVG.toUpperCase(),
                                        platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                    }}
                                />
                            </Text>
                        }
                        is_info
                    />
                </div>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' has_effect large primary onClick={onConfirm}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});

export default MT5MigrationFrontSideContent;
