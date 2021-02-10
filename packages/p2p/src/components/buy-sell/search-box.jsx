import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import { action } from 'mobx';
import { Input, Icon } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import 'Components/buy-sell/search-box.scss';

const SearchBox = () => {
    const { buy_sell_store } = useStores();

    const onSearch = ({ search }) => {
        const search_result = [];

        buy_sell_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            buy_sell_store.setSearchResult([]);
            return;
        }

        buy_sell_store.items.forEach(item => {
            if (item.advertiser_details.name.toLowerCase().includes(search.toLowerCase().trim())) {
                search_result.push(item);
            }
        });

        if (search_result.length) {
            buy_sell_store.setSearchResult(search_result);
        } else {
            buy_sell_store.setSearchResult([]);
        }
    };

    const onSearchClear = setFieldValue => {
        setFieldValue('search', '');
        buy_sell_store.setSearchTerm('');
        buy_sell_store.setSearchResult([]);
    };

    const onSearchKeyUp = submitForm => {
        clearTimeout(typing_timer);

        const typing_timer = setTimeout(
            action(() => {
                submitForm();
            }),
            1000
        );
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
                                    leading_icon={
                                        search ? (
                                            <Icon
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
                                            />
                                        ) : (
                                            <Icon icon='IcSearch' />
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

export default SearchBox;
