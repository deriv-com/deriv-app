import classNames from 'classnames';
import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import { Icon, Input } from '@deriv/components';
import './cashier-search-box.scss';

type TCashierSearchBoxProps = {
    className: string;
    onClear: () => void;
    onSearch: (search: string) => void;
    placeholder: string;
    search_term: string;
    setIsSearchLoading: (new_value: boolean) => void;
};

const CashierSearchBox = ({
    className,
    onClear,
    onSearch,
    placeholder,
    search_term,
    setIsSearchLoading,
}: TCashierSearchBoxProps) => {
    React.useEffect(() => {
        return onClear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearchClear = (setFieldValue: (field: string, value: string) => void) => {
        setFieldValue('search', '');
        onClear();
    };

    const onSearchKeyUpDown = (submitForm: () => void, search: string) => {
        if (!search.trim() && search_term) {
            onClear();
        } else if (!search.trim()) return;

        setIsSearchLoading(true);
        submitForm();
    };

    const onSearchSubmit = (values: { search: string }) => {
        onSearch(values.search);
    };

    return (
        <div className={classNames('cashier-search-box', className)}>
            <Formik initialValues={{ search: '' }} onSubmit={onSearchSubmit}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {(field: {
                                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
                                onBlur: () => void;
                                name: string;
                                value: string;
                            }) => (
                                <Input
                                    {...field}
                                    type='text'
                                    name='search'
                                    placeholder={placeholder}
                                    onKeyUp={() => onSearchKeyUpDown(submitForm, search)}
                                    onKeyDown={() => onSearchKeyUpDown(submitForm, search)}
                                    leading_icon={<Icon icon='IcSearch' data_testid='dt_search_icon' />}
                                    trailing_icon={
                                        <>
                                            !!search ?? (
                                            <Icon
                                                color='general'
                                                data_testid='dt_close_icon'
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
                                            )
                                        </>
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

export default CashierSearchBox;
