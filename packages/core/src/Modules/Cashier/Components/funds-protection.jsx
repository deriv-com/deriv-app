import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Icon, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

const FundsProtection = ({ onMount, setErrorConfig }) => {
    const handleSubmit = ({ setSubmitting }) => {
        setSubmitting(true);
        WS.send({ ukgc_funds_protection: 1, tnc_approval: 1 }).then(response => {
            if (response.error) {
                setErrorConfig('message', false);
            } else {
                setErrorConfig('is_ask_uk_funds_protection', false);
                onMount();
            }
            setSubmitting(false);
        });
    };
    return (
        <div className='funds-protection'>
            <Icon icon='IcMoneyTransfer' className='funds-protection__icon' />
            <h2 className='funds-protection__title'>{localize('Funds protection level')}</h2>
            <p className='funds-protection__desc'>
                {
                    <Localize
                        i18n_default_text="We hold customer funds in bank accounts separate from our operational accounts which would not, in the event of insolvency, form part of the company's assets. This meets the <0>Gambling Commission</0>'s requirements for the segregation of customer funds at the level: <1>medium protection</1>"
                        components={[
                            <a
                                key={0}
                                className='link link--orange'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='http://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx'
                            />,
                            <strong key={1} />,
                        ]}
                    />
                }
            </p>
            <Formik onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <Button disabled={isSubmitting} primary large type='submit'>
                            {localize('Deposit now')}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

FundsProtection.propTypes = {
    onMount: PropTypes.func,
    setErrorConfig: PropTypes.func,
};

export default connect(({ modules }) => ({
    setErrorConfig: modules.cashier.setErrorConfig,
    onMount: modules.cashier.onMount,
}))(FundsProtection);
