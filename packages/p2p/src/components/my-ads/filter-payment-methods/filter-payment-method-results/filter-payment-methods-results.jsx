import React from 'react';
import { observer } from 'mobx-react-lite';
import { Loading, RadioGroup, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const FilterPaymentMethodsResults = observer(({ filtered_payment_methods, setSelectedMethods }) => {
    const { my_ads_store } = useStores();

    if (my_ads_store.is_searching_payment_method) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_ads_store.search_term !== '' && my_ads_store.searched_results.length === 0) {
        return (
            <Text align='center' className='filter-payment-methods-results__text' size='xs'>
                {localize('There are no matching payment methods.')}
            </Text>
        );
    }

    return (
        <div className='filter-payment-methods-results'>
            <RadioGroup
                className='filter-payment-methods-results__radiogroup'
                onToggle={e => {
                    my_ads_store.handleChange(e);
                    setSelectedMethods(methods => [...methods, e.target.value]);
                    my_ads_store.setSearchTerm('');
                    my_ads_store.setSearchedResults([]);
                }}
                selected=''
                required
            >
                {my_ads_store.search_term !== ''
                    ? my_ads_store.searched_results.map((list_item, key) => {
                          return (
                              <RadioGroup.Item
                                  key={key}
                                  value={list_item.value}
                                  label={<Text size='xs'>{list_item.text}</Text>}
                              />
                          );
                      })
                    : filtered_payment_methods.map((list_item, key) => {
                          return (
                              <RadioGroup.Item
                                  key={key}
                                  value={list_item.value}
                                  label={<Text size='xs'>{list_item.text}</Text>}
                              />
                          );
                      })}
            </RadioGroup>
        </div>
    );
});

export default FilterPaymentMethodsResults;
