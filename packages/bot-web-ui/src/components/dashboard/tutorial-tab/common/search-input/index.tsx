import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import React from 'react';
import { Analytics } from '@deriv/analytics';
import debounce from 'lodash.debounce';
import { DEBOUNCE_INTERVAL_TIME } from 'Constants/bot-contents';

const SearchInput = observer(({ faq_value, setFaqSearchContent, prev_active_tutorials, setDebouncedValue }) => {
    const { dashboard } = useDBotStore();
    const { setActiveTabTutorial } = dashboard;
    const input_ref = React.useRef(null);

    const debounceChange = React.useCallback(
        debounce(
            value => {
                setDebouncedValue(value);
                Analytics.trackEvent('ce_bot_tutorial_form', {
                    action: 'search',
                    search_string: value,
                });
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
        if (faq_value !== '') {
            onFocusSearch();
        }
        setFaqSearchContent(event.target.value);
        debounceChange(event.target.value);
    };

    const onFocusSearch = () => {
        if (faq_value !== '') {
            setActiveTabTutorial(2);
            input_ref?.current?.focus();
        }
    };

    React.useEffect(() => {
        if (faq_value !== '') {
            setActiveTabTutorial(2);
        } else {
            setActiveTabTutorial(prev_active_tutorials);
        }
        input_ref?.current?.focus();
    }, [faq_value]);

    return (
        <>
            <input
                ref={input_ref}
                data-testid='id-test-input-search'
                type='text'
                placeholder={localize('Search')}
                className='dc-tabs__wrapper__group__search-input'
                onChange={event => onSearch(event)}
                onFocus={onFocusSearch}
                value={faq_value}
            />
        </>
    );
});

export default SearchInput;
