import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { SelectBlockField } from '.';

const BlocksFields = ({
    markets_dropdown,
    submarkets_dropdown,
    values,
    setFieldValue,
    onHideDropdownList,
    onChangeDropdownItem,
    symbols_dropdown,
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
            name_field={'bot-builder__trade-type'}
            label={localize('trade type 1')}
            dropdown={markets_dropdown}
            select_value={localize('trade-type 1')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__trade-type'}
            label={localize('trade type 2')}
            dropdown={markets_dropdown}
            select_value={localize('trade-type 2')}
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
            name_field={'bot-builder__contract-type'}
            label={localize('Contract type')}
            dropdown={markets_dropdown}
            select_value={localize('contract-type')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
    </div>
</>);
};

BlocksFields.displayName = 'BlocksFields';

export default BlocksFields;
