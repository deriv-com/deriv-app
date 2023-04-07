import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletConsentFormIcon from 'Assets/svgs/wallets';

const WalletsConsentForm = ({ is_eu, is_high_risk }) => (
    <React.Fragment>
        <WalletConsentFormIcon className='wallet-wrapper--icon' />
        <div className='wallet-wrapper--text'>
            <Text size='m' align='center' weight='bold' line_height='l'>
                <Localize i18n_default_text='Ready to upgrade?' />
            </Text>
            <Text align='center' line_height='l'>
                <Localize
                    i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                    components={<Text weight='bold' align='center' line_height='l' key={0} />}
                />
            </Text>
        </div>
        <div className='wallet-wrapper--info-section'>
            {is_eu ? (
                <React.Fragment>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            <Localize
                                i18n_default_text='During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be
                                  unavailable.'
                            />
                        </Text>
                    </div>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            <Localize i18n_default_text="Your open positions won't be affected and you can continue trading." />
                        </Text>
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            <Localize
                                i18n_default_text='During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be
                    unavailable.'
                            />
                        </Text>
                    </div>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            <Localize i18n_default_text="Your open positions won't be affected and you can continue trading." />
                        </Text>
                    </div>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            <Localize
                                i18n_default_text='<0>Deriv P2P</0> is not supported in wallets yet. This option will be unavailable until further notice.'
                                components={<Text weight='bold' size='xs' line_height='m' key={0} />}
                            />
                        </Text>
                    </div>
                    <div className='wallet-wrapper--info-section__text'>
                        <Icon icon='ic-info-blue' />
                        <Text size='xs' line_height='m'>
                            {is_high_risk ? (
                                <Localize i18n_default_text="You can use payment agents' services to make deposits by adding a Payment agent wallet after the upgrade." />
                            ) : (
                                <Localize
                                    i18n_default_text="You can use <0>payment agents'</0> services to make deposits by adding a Payment agent wallet after the upgrade."
                                    components={<Text weight='bold' size='xs' line_height='m' key={0} />}
                                />
                            )}
                        </Text>
                    </div>
                </React.Fragment>
            )}
        </div>
    </React.Fragment>
);

export default WalletsConsentForm;
