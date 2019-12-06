import { Autocomplete } from 'deriv-components';
import { Field }        from 'formik';
import PropTypes        from 'prop-types';
import React            from 'react';
import { localize }     from 'deriv-translations';

const SetResidenceForm = ({
    class_prefix = 'set-residence',
    children,
    header_text,
    errors,
    touched,
    setFieldValue,
    residence_list,
}) => {
    return (
        <div className={`${class_prefix}__residence-selection`}>
            { !!header_text &&
            <p className={`${class_prefix}__heading`}>
                {header_text}
            </p>
            }
            <p className={`${class_prefix}__${header_text ? 'text' : 'heading'}`}>
                {localize('Where do you live?')}
            </p>
            <Field name='residence'>
                {({ field }) => (
                    <Autocomplete
                        { ...field }
                        autoComplete='off'
                        className={`${class_prefix}__residence-field`}
                        dropdown_offset='3.2rem'
                        type='text'
                        label={ localize('Choose country') }
                        error={ touched.residence && errors.residence }
                        required
                        list_items={ residence_list }
                        onItemSelection={
                            ({ value, text }) => setFieldValue('residence', value ? text : '', true)
                        }
                    />
                )}
            </Field>
            {children}
        </div>
    );
};

SetResidenceForm.propTypes = {
    children      : PropTypes.node,
    class_prefix  : PropTypes.string,
    header_text   : PropTypes.string,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default SetResidenceForm;
