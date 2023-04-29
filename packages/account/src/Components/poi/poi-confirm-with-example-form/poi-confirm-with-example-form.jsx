import React from 'react';
import classNames from 'classnames';
import { Form } from 'formik';
import { DateOfBirthPicker, DesktopWrapper, Input, MobileWrapper } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import PoiNameDobExampleIcon from 'Assets/ic-poi-name-dob-example.svg';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';
import FormBody from 'Components/form-body';
import FormBodySection from 'Components/form-body-section';

const PoiConfirmWithExampleForm = ({
    values,
    handleChange,
    errors,
    isSubmitting,
    handleBlur,
    checked,
    setFieldValue,
}) => {
    const form_side_note = <PoiNameDobExampleIcon />;
    const name_dob_clarification_message = (
        <Localize
            i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
            components={[<strong key={0} />]}
        />
    );

    return (
        <Form className={classNames('account-form__poi-confirm-example ', {})}>
            <InlineNoteWithIcon message={name_dob_clarification_message} font_size='xs' />
            <FormBody>
                <FormBodySection has_side_note side_note={form_side_note}>
                    <DesktopWrapper>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                type='text'
                                name='first_name'
                                label={localize('First name')}
                                value={values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled={checked || isSubmitting}
                                error={errors.first_name}
                                id={'first_name'}
                                bottom_label={localize('Your first name as in your identity document')}
                            />
                            <Input
                                id={'last_name'}
                                data-lpignore='true'
                                type='text'
                                name='last_name'
                                label={localize('Last name')}
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled={checked || isSubmitting}
                                error={errors.last_name}
                                bottom_label={localize('Your last name as in your identity document')}
                            />
                            <DateOfBirthPicker
                                name='date_of_birth'
                                label={localize('Date of birth')}
                                error={errors.date_of_birth}
                                onChange={({ target }) => {
                                    setFieldValue(
                                        'date_of_birth',
                                        target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                                        true
                                    );
                                }}
                                id={'birth_day'}
                                disabled={checked || isSubmitting}
                                value={values.date_of_birth}
                                bottom_label={localize('Your date of birth as in your identity document')}
                            />
                        </fieldset>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                type='text'
                                name='first_name'
                                id='first_name_mobile'
                                label={localize('First name')}
                                value={values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled={checked || isSubmitting}
                                error={errors.first_name}
                                bottom_label={localize('Your first name as in your identity document')}
                            />
                        </fieldset>
                        <fieldset className='account-form__fieldset'>
                            <Input
                                data-lpignore='true'
                                type='text'
                                name='last_name'
                                id='last_name_mobile'
                                label={localize('Last name')}
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled={checked || isSubmitting}
                                error={errors.last_name}
                                bottom_label={localize('Your last name as in your identity document')}
                            />
                        </fieldset>
                    </MobileWrapper>
                </FormBodySection>
            </FormBody>
        </Form>
    );
};

export default PoiConfirmWithExampleForm;
