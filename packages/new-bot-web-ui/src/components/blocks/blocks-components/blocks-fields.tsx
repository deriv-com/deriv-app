import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { SelectBlockField } from '.';

const BlocksFields = ({
    markets_dropdown,
    submarkets_dropdown,
    symbols_dropdown,
    trade_type_category_dropdown,
    trade_type_dropdown,
    values,
    setFieldValue,
    onHideDropdownList,
    onChangeDropdownItem,
    onScrollStopDropdownList,
}: any) => {
    
return(<>
    <div className='bot-builder__item'>
        <Text>{localize('Market:')}</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__market'}
            label={localize('Markets')}
            dropdown={markets_dropdown}
            select_value={localize('market')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__submarket'}
            label={localize('Submarkets')}
            dropdown={submarkets_dropdown}
            select_value={localize('submarket')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__symbol'}
            label={localize('Symbols')}
            dropdown={symbols_dropdown}
            select_value={localize('symbol')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
    </div>
    <div className='bot-builder__item'>
        <Text>{localize('Trade type:')}</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__trade_type_category'}
            label={localize('Trade type categories')}
            dropdown={trade_type_category_dropdown}
            select_value={localize('trade_type_category')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__trade_type'}
            label={localize('Trade types')}
            dropdown={trade_type_dropdown}
            select_value={localize('trade_type')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
    </div>
    <div className='bot-builder__item'>
        <Text>{localize('Contract type:')}</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__contract_type'}
            label={localize('Contract type')}
            dropdown={markets_dropdown}
            select_value={localize('contract_type')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
    </div>
</>);
};

BlocksFields.displayName = 'BlocksFields';

export default BlocksFields;
