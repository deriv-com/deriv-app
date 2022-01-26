import React from 'react';
import { Icon, Input } from '@deriv/components';
import { localize } from '@deriv/translations';

type SearchInputProps = {
    onChange: () => void;
    onClickClearInput: () => void;
    value: string;
};

const SearchInput = React.forwardRef(({ onChange, onClickClearInput, value }: SearchInputProps, ref) => (
    <Input
        ref={ref}
        autoFocus
        data-lpignore='true'
        leading_icon={<Icon icon='IcSearch' />}
        trailing_icon={value ? <Icon icon='IcCloseCircle' onClick={onClickClearInput} /> : null}
        placeholder={localize('Search')}
        type='text'
        onChange={onChange}
        value={value}
    />
));

SearchInput.displayName = 'SearchInput';

export default React.memo(SearchInput);
