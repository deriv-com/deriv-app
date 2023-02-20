import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import { Icon, Input } from '@deriv/components';
import './cashier-search-box.scss';

const CashierSearchBox = ({ className, onClear, onSearch, placeholder, search_term, setIsSearchLoading }) => {
    React.useEffect(() => {
        return onClear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearchClear = setFieldValue => {
        setFieldValue('search', '');
        onClear();
    };

    const onSearchKeyUpDown = (submitForm, search) => {
        if (!search.trim() && search_term) {
            onClear();
        } else if (!search.trim()) return;

        setIsSearchLoading(true);
        submitForm();
    };

    const onSearchSubmit = ({ search }) => {
        onSearch(search);
    };

    return (
        <div className={classNames('cashier-search-box', className)}>
            <Formik initialValues={{ search: '' }} onSubmit={onSearchSubmit}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    type='text'
                                    name='search'
                                    placeholder={placeholder}
                                    onKeyUp={() => onSearchKeyUpDown(submitForm, search)}
                                    onKeyDown={() => onSearchKeyUpDown(submitForm, search)}
                                    leading_icon={<Icon icon='IcSearch' data_testid='dt_search_icon' />}
                                    trailing_icon={
                                        search && (
                                            <Icon
                                                color='general'
                                                data_testid='dt_close_icon'
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
                                        )
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

CashierSearchBox.propTypes = {
    className: PropTypes.string,
    onClear: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    search_term: PropTypes.string,
    setIsSearchLoading: PropTypes.func,
};

export default CashierSearchBox;
