import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import debounce from 'lodash.debounce';
import { Icon, Input } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './filter-modal-search.scss';

const FilterModalSearch = () => {
    const { buy_sell_store, my_profile_store } = useStores();

    const returnedFunction = debounce(() => {
        my_profile_store.getPaymentMethodsList();
        buy_sell_store.setIsFilterModalLoading(false);
    }, 1000);

    const onSearch = ({ search }) => {
        my_profile_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            my_profile_store.setSearchResults([]);
            return;
        }

        buy_sell_store.setIsFilterModalLoading(true);
        my_profile_store.setSearchResults();
        returnedFunction();
    };

    const onSearchClear = setFieldValue => {
        setFieldValue('search', '');
        my_profile_store.setSearchTerm('');
        my_profile_store.setSearchResults([]);
    };

    const onSearchKeyUp = submitForm => {
        clearTimeout(typing_timer);

        const typing_timer = setTimeout(() => {
            submitForm();
        }, 1000);
    };

    return (
        <div className='filter-modal-search'>
            <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='filter-modal-search__field'
                                    data-lpignore='true'
                                    leading_icon={<Icon className='filter-modal-search__field-icon' icon='IcSearch' />}
                                    name='search'
                                    onFocus={submitForm}
                                    onKeyUp={() => onSearchKeyUp(submitForm)}
                                    placeholder={isDesktop() ? localize('Search payment method') : localize('Search')}
                                    trailing_icon={
                                        search ? (
                                            <Icon
                                                className='filter-modal-search__cross-icon'
                                                color='secondary'
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                            />
                                        ) : null
                                    }
                                    type='text'
                                />
                            )}
                        </FormField>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default observer(FilterModalSearch);
