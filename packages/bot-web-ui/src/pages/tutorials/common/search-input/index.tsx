import React from 'react';
import debounce from 'lodash.debounce';
import { Analytics } from '@deriv-com/analytics';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { DEBOUNCE_INTERVAL_TIME } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';

const SearchInput = observer(({ faq_value, setFaqSearchContent, prev_active_tutorials }) => {
    const { dashboard } = useDBotStore();
    const input_ref = React.useRef(null);
    const { setActiveTabTutorial, filterTuotrialTab } = dashboard;

    const debounceChange = React.useCallback(
        debounce(
            value => {
                filterTuotrialTab(value);
                setActiveTabTutorial(3);
                Analytics.trackEvent('ce_bot_tutorial_form', {
                    action: 'search',
                    search_string: value,
                });
                if (value === '') {
                    setActiveTabTutorial(prev_active_tutorials);
                }
            },
            DEBOUNCE_INTERVAL_TIME,
            {
                trailing: true,
                leading: false,
            }
        ),
        []
    );
    const onSearch = event => {
        setFaqSearchContent(event.target.value);
        debounceChange(event.target.value);
    };

    return (
        <>
            <input
                ref={input_ref}
                data-testid='id-test-input-search'
                type='text'
                placeholder={localize('Search')}
                className='dc-tabs__wrapper__group__search-input'
                onChange={event => onSearch(event)}
                value={faq_value}
            />
        </>
    );
});

export default SearchInput;
