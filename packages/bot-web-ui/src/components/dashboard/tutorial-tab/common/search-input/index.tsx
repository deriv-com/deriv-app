import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import React from 'react';
import debounce from 'lodash.debounce';

const DEBOUNCE_INTERVAL_TIME = 300;
const SearchInput = observer(({ faq_value, setFaqSearchContent, prev_active_tutorials }) => {
    const { dashboard } = useDBotStore();
    const input_ref = React.useRef(null);
    const { setActiveTabTutorial, filterTuotrialTab } = dashboard;

    const debounceChange = React.useCallback(
        debounce(
            value => {
                filterTuotrialTab(value);
                setActiveTabTutorial(2);
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
