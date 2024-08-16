import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { InlineMessage, Text, Button, Modal, Icon } from '@deriv/components';
import { Jurisdiction, CFD_PLATFORMS, getCFDPlatformNames, getFormattedJurisdictionCode } from '@deriv/shared';

type TMigrationSuccessModalContent = {
    icon?: string;
    eligible_account_to_migrate: string;
    closePopupModal: () => void;
    jurisdiction_market_name: Array<string>;
};

const MigrationSuccessModalContent = observer(
    ({
        icon,
        eligible_account_to_migrate,
        jurisdiction_market_name,
        closePopupModal,
    }: TMigrationSuccessModalContent) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const platform = getCFDPlatformNames(CFD_PLATFORMS.MT5);
        const text_size = is_mobile ? 'xxs' : 'xs';
        const information_text_size = is_mobile ? 'xxxs' : 'xxs';
        const getFormattedAccounts = () =>
            jurisdiction_market_name.length > 1
                ? {
                      type_1: jurisdiction_market_name[0],
                      type_2: jurisdiction_market_name[1],
                  }
                : {
                      type_1: jurisdiction_market_name[0],
                  };
        return (
            <div className='cfd-success-dialog-migration__modal-content'>
                <Modal.Body className={classNames('cfd-success-dialog-migration__body')}>
                    <div className='cfd-success-dialog-migration__icon-area'>
                        {icon && <Icon icon={icon} size={128} />}
                    </div>
                    <div>
                        <Text as='h2' weight='bold' className='cfd-success-dialog-migration__title'>
                            <Localize i18n_default_text='Upgrade complete' />
                        </Text>
                        <div className='cfd-success-dialog-migration__content-wrapper'>
                            <Text size={text_size} as='p' align='center'>
                                {jurisdiction_market_name.length > 1 ? (
                                    <Localize
                                        i18n_default_text='Start trading with your new <0>{{platform}} {{type_1}}</0> and <0>{{type_2}} {{eligible_account_to_migrate}}</0> accounts.'
                                        values={{
                                            platform,
                                            eligible_account_to_migrate,
                                            ...getFormattedAccounts(),
                                        }}
                                        components={[<strong key={0} />]}
                                    />
                                ) : (
                                    <Localize
                                        i18n_default_text='Start trading with your new <0>{{platform}} {{type_1}} {{eligible_account_to_migrate}}</0> account.'
                                        values={{
                                            platform,
                                            eligible_account_to_migrate,
                                            ...getFormattedAccounts(),
                                        }}
                                        components={[<strong key={0} />]}
                                    />
                                )}
                            </Text>
                            <div className='cfd-success-dialog-migration__inline-msg'>
                                <InlineMessage
                                    type='information'
                                    size='sm'
                                    title={
                                        <Localize
                                            i18n_default_text='Important: Your <0>{{platform}} {{existing_account}}</0> account.'
                                            values={{
                                                platform,
                                                existing_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
                                            }}
                                            components={[<strong key={0} />]}
                                        />
                                    }
                                    message={
                                        <Text
                                            as='ul'
                                            size={information_text_size}
                                            className={'cfd-success-dialog-migration__body-bullets--list'}
                                        >
                                            <li>
                                                <Localize i18n_default_text="You can manage your existing positions, but you can't start a new trade." />
                                            </li>
                                            <li>
                                                <Localize i18n_default_text="We'll close accounts with no open positions after 60 days." />
                                            </li>
                                        </Text>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer has_separator className='cfd-success-dialog-migration-footer'>
                    <Button has_effect onClick={closePopupModal} primary large>
                        <Localize i18n_default_text='OK' />
                    </Button>
                </Modal.Footer>
            </div>
        );
    }
);

export default MigrationSuccessModalContent;
