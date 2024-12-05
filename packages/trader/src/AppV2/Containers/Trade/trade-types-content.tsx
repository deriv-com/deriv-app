import React from 'react';
import { Button, Text, ActionSheet } from '@deriv-com/quill-ui';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { Localize } from '@deriv/translations';
import { TItem, TResultItem } from './trade-types';

type TTradeTypesContent = {
    handleCustomizeTradeTypes: () => void;
    handleRemovePinnedClick: (item: TItem) => void;
    handleOnDrag: (categories: TResultItem[]) => void;
    handleOnTradeTypeSelect: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    handleAddPinnedClick: (item: TItem) => void;
    is_editing?: boolean;
    is_dark_mode_on: boolean;
    isTradeTypeSelected: (value: string) => boolean;
    savePinnedToLocalStorage: () => void;
    show_trade_type_list_divider?: boolean;
    show_editing_divider?: boolean;
    other_trade_types: TResultItem[];
    pinned_trade_types: TResultItem[];
};

const TradeTypesContent = ({
    handleCustomizeTradeTypes,
    handleRemovePinnedClick,
    handleOnDrag,
    handleOnTradeTypeSelect,
    handleAddPinnedClick,
    is_editing,
    is_dark_mode_on,
    isTradeTypeSelected,
    savePinnedToLocalStorage,
    show_trade_type_list_divider,
    show_editing_divider,
    other_trade_types,
    pinned_trade_types,
}: TTradeTypesContent) => (
    <React.Fragment>
        <div>
            <div className='draggable-list-category-header'>
                <Text size='sm' bold className='draggable-list-category-header-title'>
                    {is_editing && <Localize i18n_default_text='Pinned' />}
                </Text>
                <Button
                    color={is_dark_mode_on ? 'white' : 'black'}
                    variant='secondary'
                    className='draggable-list-category-header-button'
                    onClick={is_editing ? savePinnedToLocalStorage : handleCustomizeTradeTypes}
                >
                    {is_editing ? <Localize i18n_default_text='Done' /> : <Localize i18n_default_text='Customise' />}
                </Button>
            </div>
        </div>
        <ActionSheet.Content className='trade-types-dialog__content'>
            {is_editing ? (
                <DraggableList
                    categories={pinned_trade_types}
                    onRightIconClick={handleRemovePinnedClick}
                    onDrag={handleOnDrag}
                    show_editing_divider={show_editing_divider}
                />
            ) : (
                <TradeTypeList
                    categories={pinned_trade_types}
                    onTradeTypeClick={handleOnTradeTypeSelect}
                    isSelected={isTradeTypeSelected}
                    selectable
                    show_divider={show_trade_type_list_divider}
                />
            )}
            <TradeTypeList
                categories={other_trade_types}
                onRightIconClick={is_editing ? handleAddPinnedClick : undefined}
                onTradeTypeClick={is_editing ? undefined : handleOnTradeTypeSelect}
                isSelected={isTradeTypeSelected}
                selectable={!is_editing}
            />
        </ActionSheet.Content>
    </React.Fragment>
);

export default TradeTypesContent;
