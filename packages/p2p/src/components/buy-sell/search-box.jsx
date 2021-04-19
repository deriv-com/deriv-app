import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import debounce from 'lodash.debounce';
import { Icon, Input } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import 'Components/buy-sell/search-box.scss';

const SearchBox = () => {
    const { buy_sell_store } = useStores();

    const returnedFunction = debounce(() => {
        buy_sell_store.loadMoreItems({ startIndex: 0 });
    }, 1000);

    const onSearch = ({ search }) => {
        buy_sell_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            buy_sell_store.setSearchResults([]);
            return;
        }

        buy_sell_store.setIsLoading(true);
        returnedFunction();
    };

    const onSearchClear = setFieldValue => {
        setFieldValue('search', '');
        buy_sell_store.setSearchTerm('');
        buy_sell_store.setSearchResults([]);
    };

    const onSearchKeyUp = submitForm => {
        clearTimeout(typing_timer);

        const typing_timer = setTimeout(() => {
            submitForm();
        }, 1000);
    };

    return (
        <div className='search-box'>
            <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
                {({ submitForm, values: { search }, setFieldValue }) => (
                    <Form>
                        <FormField name='search'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    className='search-box__field'
                                    type='text'
                                    name='search'
                                    placeholder={isDesktop() ? localize('Search by nickname') : localize('Search')}
                                    onKeyUp={() => onSearchKeyUp(submitForm)}
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

export default observer(SearchBox);
