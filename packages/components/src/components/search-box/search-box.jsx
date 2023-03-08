import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field as FormField, Formik, Form } from 'formik';
import Icon from '../icon';
import Input from '../input';

const SearchBox = ({ className, onClear, onSearch, placeholder }) => {
    const onSearchClear = setFieldValue => {
        setFieldValue('search', '');

        if (typeof onClear === 'function') {
            onClear();
        }
    };

    const onSearchKeyUpDown = submitForm => {
        clearTimeout(typing_timer);

        const typing_timer = setTimeout(() => {
            submitForm();
        }, 500);
    };

    const onSearchSubmit = ({ search }) => {
        if (!search.trim()) {
            if (typeof onClear === 'function') {
                onClear();
            }
            return;
        }

        if (typeof onSearch === 'function') {
            onSearch(search);
        }
    };

    return (
        <div className={classNames('search-box', className)}>
            <Formik initialValues={{ search: '' }} onSubmit={onSearchSubmit}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='search-box__field'
                                    type='text'
                                    name='search'
                                    placeholder={placeholder}
                                    onKeyDown={() => onSearchKeyUpDown(submitForm)}
                                    onKeyUp={() => onSearchKeyUpDown(submitForm)}
                                    onFocus={submitForm}
                                    leading_icon={<Icon className='search-box__field-icon' icon='IcSearch' />}
                                    trailing_icon={
                                        search ? (
                                            <Icon
                                                className='search-box__cross-icon'
                                                color='secondary'
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
                                        ) : null
                                    }
                                />
                            )}
                        </FormField>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

SearchBox.propTypes = {
    className: PropTypes.string,
    onClear: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
};

export default SearchBox;
