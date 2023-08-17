import React from 'react';
import { Icon, Input } from '@deriv/components';
import { localize } from '@deriv/translations';

type TSearchInput = {
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | null>;
    onClickClearInput: () => void;
    value: string;
};

const SearchInput = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, TSearchInput>(
    ({ onChange, onClickClearInput, value }, ref) => (
        <Input
            ref={ref}
            data-lpignore='true'
            leading_icon={<Icon icon='IcSearch' />}
            trailing_icon={value ? <Icon icon='IcCloseCircle' onClick={onClickClearInput} /> : undefined}
            placeholder={localize('Search')}
            type='text'
            onChange={onChange}
            value={value}
        />
    )
);

SearchInput.displayName = 'SearchInput';

export default React.memo(SearchInput);
