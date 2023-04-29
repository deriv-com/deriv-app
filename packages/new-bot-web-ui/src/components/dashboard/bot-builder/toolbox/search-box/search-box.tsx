import React from 'react';
import { Field as FormField, Formik, Form, FieldProps } from 'formik';
import { Input } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchIcon from './search-icon';

type TSearchBox = {
    is_search_loading: boolean;
    onSearch: () => void;
    onSearchBlur: () => void;
    onSearchClear: (param: (field: string, value: number | string, shouldValidate?: boolean) => void) => void;
    onSearchKeyUp: (param: () => void) => void;
};

type TFormValues = { [key: string]: string };

const SearchBox = ({ is_search_loading, onSearch, onSearchBlur, onSearchClear, onSearchKeyUp }: TSearchBox) => (
    <div className='db-toolbox__search'>
        <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
            {({ submitForm, values: { search }, setFieldValue }) => (
                <Form>
                    <FormField name='search'>
                        {({ field }: FieldProps<string, TFormValues>) => (
                            <Input
                                {...field}
                                className='db-toolbox__search-field'
                                type='text'
                                name='search'
                                placeholder={localize('Search')}
                                onKeyUp={() => onSearchKeyUp(submitForm)}
                                onFocus={submitForm}
                                onBlur={onSearchBlur}
                                leading_icon={
                                    <SearchIcon
                                        search={search}
                                        is_search_loading={is_search_loading}
                                        onClick={() => onSearchClear(setFieldValue)}
                                    />
                                }
                            />
                        )}
                    </FormField>
                </Form>
            )}
        </Formik>
    </div>
);

export default SearchBox;
