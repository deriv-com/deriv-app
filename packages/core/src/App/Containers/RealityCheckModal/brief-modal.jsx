import PropTypes from 'prop-types';
import React from 'react';
import { Formik } from 'formik';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    Modal,
    FormSubmitButton,
    Text,
    RadioGroup,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const BriefModal = ({
    disableApp,
    enableApp,
    IntervalField,
    SpendingLimitIntervalField,
    is_visible,
    logout,
    onSubmit,
    validateForm,
}) => {
    return (
        <Modal
            className='reality-check'
            enableApp={enableApp}
            is_open={is_visible}
            disableApp={disableApp}
            has_close_icon={false}
            title={
                isDesktop()
                    ? localize('Spending limit and trading statistics')
                    : localize('Set spend limit and trading status’ duration')
            }
            portalId='modal_root_absolute'
            width='588px'
        >
            <Formik
                initialValues={{
                    interval: '',
                    max_30day_turnover: '',
                    spending_limit: '1',
                }}
                validate={validateForm}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                    <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                        {({ setRef }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className='reality-check__wrapper'
                                    height_offset='204px'
                                    is_disabled={isDesktop()}
                                >
                                    <ThemedScrollbars height={500} className='reality-check__scrollbar'>
                                        <div className='reality-check__section'>
                                            <Text
                                                as='strong'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                weight='bold'
                                                className='reality-check__text reality-check__text--title'
                                            >
                                                <Localize i18n_default_text='Spending limit' />
                                            </Text>
                                            <Text
                                                as='p'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                className='reality-check__text reality-check__text--description'
                                            >
                                                {isDesktop() ? (
                                                    <Localize i18n_default_text='You can limit the total amount you spend in 30 days, trading on DTrader, DBot, and SmartTrader. This limit will get renewed automatically every 30 days. If you wish to remove the limit or increase your spending amount, please contact our Client Support team via live chat on our website.' />
                                                ) : (
                                                    <Localize
                                                        i18n_default_text='You can limits your total spend for every 30 days across all Deriv platforms. To remove or weaken limit, please contact our Customer Support by calling <0>+447723580049.</0>'
                                                        components={[<span key='0' className='link link--orange' />]}
                                                    />
                                                )}
                                            </Text>
                                            <div style={{ display: 'flex', marginBottom: isDesktop() ? 25 : 4 }}>
                                                <RadioGroup
                                                    name='spending_limit'
                                                    className='radio-group--spending_limit'
                                                    selected={values.spending_limit}
                                                    onToggle={e => {
                                                        e.persist();
                                                        handleChange({
                                                            target: {
                                                                name: 'spending_limit',
                                                                value: e.target.value,
                                                            },
                                                        });
                                                    }}
                                                >
                                                    {[
                                                        { id: '1', label: 'Set a 30-day spending limit', value: '1' },
                                                        { id: '0', label: 'No spending limit', value: '0' },
                                                    ].map(item => (
                                                        <RadioGroup.Item
                                                            key={item.value}
                                                            label={item.label}
                                                            value={item.value}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                            <SpendingLimitIntervalField
                                                values={values}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                disabled={values.spending_limit === '0'}
                                            />
                                            {isDesktop() && (
                                                <Text
                                                    as='p'
                                                    size='xs'
                                                    line_height='m'
                                                    className='reality-check__text reality-check__text--description'
                                                >
                                                    <Localize i18n_default_text='If you decide to set a spending limit later, you can always do so by going to “Self-exclusion” in your account settings.' />
                                                </Text>
                                            )}
                                        </div>
                                        <div className='reality-check__separator' />
                                        <div className='reality-check__section'>
                                            <Text
                                                as='strong'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                weight='bold'
                                                className='reality-check__text reality-check__text--title'
                                            >
                                                <Localize i18n_default_text='Viewing trading statistics' />
                                            </Text>
                                            <Text
                                                as='p'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                className='reality-check__text reality-check__text--description'
                                            >
                                                <Localize i18n_default_text='We’ll show you details of your trades, such as your profit and loss, from time to time. This information will help you decide if you want to continue trading or not.' />
                                            </Text>
                                            <Text
                                                as='p'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                align='center'
                                                className='reality-check__text reality-check__text--description'
                                            >
                                                <Localize i18n_default_text='When do you want to view your trading statistics?' />
                                            </Text>
                                            <IntervalField
                                                values={values}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator>
                                    <FormSubmitButton
                                        className='reality-check__submit'
                                        has_cancel
                                        cancel_label={localize('Log out')}
                                        is_disabled={!values.interval || !isValid || isSubmitting}
                                        label={localize('Continue trading')}
                                        onCancel={logout}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        </Modal>
    );
};

BriefModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    IntervalField: PropTypes.func,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openStatement: PropTypes.func,
    validateForm: PropTypes.func,
};

export default BriefModal;
