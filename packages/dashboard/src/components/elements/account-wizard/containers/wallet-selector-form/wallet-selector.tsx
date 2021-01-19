import { Formik } from 'formik';
import React from 'react';
import classNames from 'classnames';
import { Modal, Div100vhContainer, FormSubmitButton, Icon, ThemedScrollbars } from '@deriv/components';
import { isMobile, isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';

const WalletSelector: React.FC = (props: any) => {
    const { onSubmit, getCurrentStep, goToNextStep, validate } = props;
    const [wallets] = React.useState([
        'IcWalletSkrill',
        'IcWalletCreditDebit',
        'IcWalletCrypto',
        'IcWalletDp2p',
        'IcWalletPaymentAgent',
        'IcWalletNeteller',
        'IcWalletZingpay',
        'IcWalletWebmoney',
        'IcWalletJeton',
        'IcWalletSticpay',
        'IcWalletPaytrust',
        'IcWalletFasapay',
    ]);

    const handleValidate = (values: any) => {
        const { errors } = validate(values);
        return errors;
    };

    return (
        <Formik
            initialValues={{ ...props.value }}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <Div100vhContainer height_offset='110px' is_disabled={isDesktop()}>
                        <ThemedScrollbars>
                            <div className='dw-wallet-selector'>
                                {wallets.map((wallet, i) => (
                                    <div
                                        key={`${wallet}${i}`}
                                        className={classNames('dw-wallet-selector__wallet-item', {
                                            'dw-wallet-selector__wallet-item--selected': values.wallet === wallet,
                                        })}
                                        onClick={() => {
                                            setFieldValue('wallet', wallet);
                                        }}
                                    >
                                        {values.wallet === wallet && (
                                            <div className='dw-wallet-selector__selected-icon'>
                                                <Icon
                                                    size={24}
                                                    icon='IcDashboardCheck'
                                                    custom_color='var(--badge-blue)'
                                                />
                                            </div>
                                        )}
                                        <Icon icon={wallet} />
                                    </div>
                                ))}
                            </div>
                        </ThemedScrollbars>
                    </Div100vhContainer>
                    <Modal.Footer has_separator is_bypassed={isMobile()}>
                        <FormSubmitButton
                            is_disabled={isSubmitting || !values.wallet}
                            is_absolute={isMobile()}
                            label={localize('Next')}
                        />
                    </Modal.Footer>
                </form>
            )}
        </Formik>
    );
};

export default WalletSelector;
