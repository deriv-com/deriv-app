import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const NoSearchResult = observer(() => {
    const { dashboard } = useDBotStore();
    const { faq_search_value } = dashboard;
    return (
        <div className='dc-tabs__content dc-tabs__content--no-result'>
            <Icon icon='IcDbotNoSearchResult' size={80} />
            <Text className='dc-tabs__content--no-result__title' as='h1' weight='bold' line_height='xxs'>
                <Localize i18n_default_text='No results found' />
            </Text>
            <Text className='dc-tabs__content--no-result__content' line_height='xxs'>
                {localize('We couldn’t find anything matching "{{ faq_search_value }}".Try another term.', {
                    faq_search_value,
                })}
            </Text>
        </div>
    );
});

export default NoSearchResult;
