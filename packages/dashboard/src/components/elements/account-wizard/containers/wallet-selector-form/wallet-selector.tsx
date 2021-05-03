import { Formik } from 'formik';
import React from 'react';
import classNames from 'classnames';
import {
    Modal,
    Div100vhContainer,
    FormSubmitButton,
    Icon,
    ThemedScrollbars,
    AutoHeightWrapper,
} from '@deriv/components';
import { isMobile, isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';

const WalletSelector: React.FC = (props: any) => {
    const { onSubmit, getCurrentStep, goToNextStep, validate, onSubmitEnabledChange, selected_step_ref } = props;
    const [wallets] = React.useState([
        'IcWalletSkrillLight',
        'IcWalletCreditDebitLight',
        'IcWalletCryptoLight',
        'IcWalletDp2pLight',
        'IcWalletPaymentAgentLight',
        'IcWalletNetellerLight',
        'IcWalletZingpayLight',
        'IcWalletWebmoneyLight',
        'IcWalletJetonLight',
        'IcWalletSticpayLight',
        'IcWalletPaytrustLight',
        'IcWalletFasapayLight',
    ]);
    const is_submit_disabled_ref = React.useRef<boolean>(true);

    const isSubmitDisabled = (values: any) => {
        return selected_step_ref?.current?.isSubmitting || !values.wallet;
    };

    const checkSubmitStatus = (values: any) => {
        const is_submit_disabled = isSubmitDisabled(values);

        if (is_submit_disabled_ref.current !== is_submit_disabled) {
            is_submit_disabled_ref.current = is_submit_disabled;
            onSubmitEnabledChange?.(!is_submit_disabled);
        }
    };

    const handleValidate = (values: any) => {
        checkSubmitStatus(values);
        const { errors } = validate(values);
        return errors;
    };

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={{ ...props.value }}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <AutoHeightWrapper default_height={450} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef, height }: { setRef: (instance: HTMLFormElement | null) => void; height: number }) => (
                        <form ref={setRef} onSubmit={handleSubmit} autoComplete='off'>
                            <Div100vhContainer height_offset='242px' is_disabled={isDesktop()}>
                                <ThemedScrollbars is_bypassed={isMobile()} height={height}>
                                    <div className='dw-wallet-selector'>
                                        {wallets.map((wallet, i) => (
                                            <div
                                                key={`${wallet}${i}`}
                                                className={classNames('dw-wallet-selector__wallet-item', {
                                                    'dw-wallet-selector__wallet-item--selected':
                                                        values.wallet === wallet,
                                                })}
                                                onClick={() => {
                                                    setFieldValue('wallet', wallet);
                                                }}
                                            >
                                                <Icon icon={wallet} />
                                            </div>
                                        ))}
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitDisabled(values)}
                                    is_absolute
                                    label={localize('Next')}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default WalletSelector;
