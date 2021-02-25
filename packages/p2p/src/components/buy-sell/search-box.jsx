import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import { Input, Icon } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import 'Components/buy-sell/search-box.scss';

const SearchBox = () => {
    const { buy_sell_store } = useStores();

    const onSearch = ({ search }) => {
        const search_results = [];

        buy_sell_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            buy_sell_store.setSearchResults([]);
            return;
        }

        buy_sell_store.items.forEach(item => {
            if (item.advertiser_details.name.toLowerCase().includes(search.toLowerCase().trim())) {
                search_results.push(item);
            }
        });

        if (search_results.length) {
            buy_sell_store.setSearchResults(search_results);
        } else {
            buy_sell_store.setSearchResults([]);
        }
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
                                    leading_icon={<Icon icon='IcSearch' />}
                                    trailing_icon={
                                        search ? (
                                            <Icon
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
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
