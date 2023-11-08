import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import React from 'react';

const SearchInput = observer(({ input_ref, faq_value, setFaqSearchContent }) => {
    const { dashboard } = useDBotStore();
    const { setActiveTabTutorial } = dashboard;

    const onSearch = event => {
        setFaqSearchContent(event.target.value);
    };

    const onFocusSearch = () => {
        setActiveTabTutorial(2);
        input_ref?.current?.focus();
    };

    return (
        <>
            <input
                ref={input_ref}
                data-testid='id-test-input-search'
                type='text'
                placeholder={localize('Search')}
                className='dc-tabs__wrapper__group__search-input'
                onChange={onSearch}
                onFocus={onFocusSearch}
                value={faq_value}
            />
        </>
    );
});

export default SearchInput;
