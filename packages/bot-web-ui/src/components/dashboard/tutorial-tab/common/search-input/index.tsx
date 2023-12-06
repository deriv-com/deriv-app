import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import React from 'react';

const SearchInput = observer(({ faq_value, setFaqSearchContent, prev_active_tutorials }) => {
    const { dashboard } = useDBotStore();
    const { setActiveTabTutorial } = dashboard;
    const input_ref = React.useRef(null);

    const onSearch = event => {
        if (faq_value !== '') {
            onFocusSearch();
        }
        setFaqSearchContent(event.target.value);
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
