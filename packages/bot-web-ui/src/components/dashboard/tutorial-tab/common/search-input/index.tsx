import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { Analytics } from '@deriv/analytics';
import React from 'react';
import debounce from 'lodash.debounce';

const DEBOUNCE_INTERVAL_TIME = 2000;
const SearchInput = observer(({ ref, faq_value, setFaqSearchContent, prev_active_tutorials, setDebouncedValue }) => {
    const { dashboard } = useDBotStore();
    const { setActiveTabTutorial } = dashboard;
    const input_ref = React.useRef(null);

    const throttleChange = React.useCallback(
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
        throttleChange(event.target.value);
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

    const sendToRudderStack = () => {
        if (ref?.current?.value) {
            Analytics.trackEvent('ce_bot_builder_form', {
                search_string: ref?.current?.value,
            });
        }
    };
    React.useEffect(() => {
        /* 
           This is done because debounce was not working added a settimeout on 
           on every key_up it will clear the prev timeout id and will add a new on the last stroke
        */
        let timeout_id: ReturnType<typeof setTimeout>;
        const getValueForRudderStack = () => {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout(() => sendToRudderStack(), 1000);
        };
        ref?.current?.addEventListener('input', getValueForRudderStack);
        return () => {
            ref?.current?.removeEventListener('input', getValueForRudderStack);
            if (timeout_id) clearTimeout(timeout_id);
        };
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
