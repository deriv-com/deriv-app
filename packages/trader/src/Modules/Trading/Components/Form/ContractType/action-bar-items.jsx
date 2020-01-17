import React        from 'react';
import {
    Icon,
    Input }         from '@deriv/components';
import { localize } from '@deriv/translations';

export const ContractTypeInfoHeader = ({
    item,
    onBackButtonClick,
}) => (
    <div className='contract-type-info__header'>
        <span id='dt_contract_info_back_nav' onClick={onBackButtonClick}>
            <Icon icon='IcArrowLeftBold' />
        </span>
        <span className='title'>{item.text}</span>
    </div>
);

const SearchInput = ({
    onClickClearInput,
    onChange,
    value,
}) => {
    return (
        <Input
            autoFocus
            data-lpignore='true'
            leading_icon={<Icon icon='IcSearch' />}
            trailing_icon={value ? <Icon icon='IcCloseCircle' onClick={onClickClearInput} /> : null}
            placeholder={localize('Search')}
            type='text'
            onChange={onChange}
            value={value}
        />
    );
};

export const MemoizedSearchInput = React.memo(SearchInput);
