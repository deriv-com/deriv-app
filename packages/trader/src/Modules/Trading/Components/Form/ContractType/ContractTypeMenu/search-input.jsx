import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Input } from '@deriv/components';
import { localize } from '@deriv/translations';

const SearchInput = React.forwardRef(({ onChange, onClickClearInput, value }, ref) => (
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

SearchInput.propTypes = {
    onChange: PropTypes.func,
    onClickClearInput: PropTypes.func,
    value: PropTypes.string,
};

SearchInput.displayName = 'SearchInput';

export default React.memo(SearchInput);
