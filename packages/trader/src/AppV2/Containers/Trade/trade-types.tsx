import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Chip, Text, ActionSheet } from '@deriv-com/quill-ui';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';
import { Localize, localize } from '@deriv/translations';
import Guide from '../../Components/Guide';

type TTradeTypesProps = {
    onTradeTypeSelect: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    trade_types: ReturnType<typeof getTradeTypesList>;
    contract_type: string;
} & Pick<ReturnType<typeof useTraderStore>, 'contract_type'>;

type TItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

type TResultItem = {
    id: string;
    title?: string;
    button_title?: string;
    onButtonClick?: () => void;
    items: TItem[];
};

const TradeTypes = ({ contract_type, onTradeTypeSelect, trade_types }: TTradeTypesProps) => {
    const [is_open, setIsOpen] = React.useState<boolean>(false);
    const [is_editing, setIsEditing] = React.useState<boolean>(false);

    const { onMount, onUnmount } = useTraderStore();

    const createArrayFromCategories = (data: any): TItem[] => {
        const result: TItem[] = [];

        data.forEach((category: { value: string; text: string }) => {
            result.push({
                id: category.value,
                title: category.text,
            });
        });

        return result;
    };

    const saved_other_trade_types = JSON.parse(localStorage.getItem('other_trade_types') ?? '[]');
    const saved_pinned_trade_types = JSON.parse(localStorage.getItem('pinned_trade_types') ?? '[]');

    const [other_trade_types, setOtherTradeTypes] = React.useState<TResultItem[]>(saved_other_trade_types);
    const [pinned_trade_types, setPinnedTradeTypes] = React.useState<TResultItem[]>(saved_pinned_trade_types);

    const handleCloseTradeTypes = () => {
        setIsOpen(false);
        setIsEditing(false);
    };

    const handleCustomizeTradeTypes = () => {
        setPinnedTradeTypes(saved_pinned_trade_types);
        setOtherTradeTypes(saved_other_trade_types);
        setIsEditing(true);
    };

    const handleAddPinnedClick = (item: TItem) => {
        setOtherTradeTypes(prev_categories => modifyCategories(prev_categories, item, 'remove'));
        setPinnedTradeTypes(prev_pinned => modifyPinnedCategories(prev_pinned, item, 'add'));
    };

    const handleRemovePinnedClick = (item: TItem) => {
        setPinnedTradeTypes(prev_categories => modifyCategories(prev_categories, item, 'remove'));
        setOtherTradeTypes(prev_others => modifyOtherCategories(prev_others, item));
    };

    const modifyPinnedCategories = (categories: TResultItem[], item: TItem, action: 'add' | 'remove') => {
        const updated_categories = [...categories];
        const pinned_category = updated_categories.find(cat => cat.id === 'pinned');

        if (action === 'add') {
            if (pinned_category) {
                pinned_category.items.push(item);
            } else {
                updated_categories.push({
                    id: 'pinned',
                    title: localize('Pinned'),
                    items: [item],
                });
            }
        } else if (action === 'remove') {
            updated_categories.map(category => ({
                ...category,
                items: category.items.filter(i => i.id !== item.id),
            }));
        }

        return updated_categories;
    };

    const modifyCategories = (categories: TResultItem[], item: TItem, action: 'remove' = 'remove') =>
        categories.map(category => ({
            ...category,
            items:
                action === 'remove'
                    ? category.items.filter(i => i.id !== item.id)
                    : category.items.filter(i => i.id !== item.id).sort((a, b) => a.title?.localeCompare(b.title)),
        }));

    const modifyOtherCategories = (categories: TResultItem[], item: TItem) => {
        const updated_categories = [...categories];
        const other_category = updated_categories.find(cat => cat.id === 'other');

        if (other_category) {
            other_category.items.unshift(item);
        } else {
            updated_categories.push({
                id: 'other',
                items: [item],
            });
        }

        return updated_categories.map(category => ({
            ...category,
            items: category.items.sort((a, b) => a.title?.localeCompare(b.title)),
        }));
    };

    React.useEffect(() => {
        const formatted_items = createArrayFromCategories(trade_types);
        const default_pinned_trade_types = [
            {
                id: 'pinned',
                title: localize('Pinned'),
                items: formatted_items.slice(0, 1),
            },
        ];
        const default_other_trade_types = [
            {
                id: 'other',
                items: formatted_items
                    .filter(item => !pinned_trade_types[0]?.items.some(pinned_item => pinned_item.id === item.id))
                    .filter(item =>
                        saved_pinned_trade_types.length < 1
                            ? !default_pinned_trade_types[0]?.items.some(pinned_item => pinned_item.id === item.id)
                            : item
                    )
                    .sort((a, b) => a.title?.localeCompare(b.title)),
            },
        ];

        if (saved_pinned_trade_types.length < 1) {
            setPinnedTradeTypes(default_pinned_trade_types);
            localStorage.setItem('pinned_trade_types', JSON.stringify(default_pinned_trade_types));
        }

        setOtherTradeTypes(default_other_trade_types);
        localStorage.setItem('other_trade_types', JSON.stringify(default_other_trade_types));
    }, [trade_types]);

    React.useEffect(() => {
        onMount();

        if (saved_pinned_trade_types.length > 0) {
            setPinnedTradeTypes(saved_pinned_trade_types);
        }

        if (saved_other_trade_types.length > 0) {
            setOtherTradeTypes(saved_other_trade_types);
        }

        return () => {
            onUnmount();
        };
    }, []);

    const savePinnedToLocalStorage = () => {
        localStorage.setItem('pinned_trade_types', JSON.stringify(pinned_trade_types));
        localStorage.setItem('other_trade_types', JSON.stringify(other_trade_types));
        setIsEditing(false);
    };

    const handleOnDrag = (categories: TResultItem[]) => {
        setPinnedTradeTypes(categories);
    };

    const handleOnTradeTypeSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onTradeTypeSelect(e);
        setIsOpen(false);
    };

    const isTradeTypeSelected = (value: string) =>
        [contract_type, value].every(type => type.startsWith('vanilla')) ||
        [contract_type, value].every(type => type.startsWith('turbos')) ||
        [contract_type, value].every(type => type.startsWith('rise_fall')) ||
        contract_type === value;
    return (
        <div className='trade__trade-types'>
            {saved_pinned_trade_types.length > 0 &&
                saved_pinned_trade_types[0].items.map(({ title, id }: TItem) => (
                    <Chip.Selectable key={id} onChipSelect={onTradeTypeSelect} selected={isTradeTypeSelected(id)}>
                        <Text size='sm'>{title}</Text>
                    </Chip.Selectable>
                ))}
            {!saved_pinned_trade_types[0]?.items.some((item: TItem) => item.id === contract_type) &&
                saved_other_trade_types[0]?.items
                    .filter((item: TItem) => item.id === contract_type)
                    .map(({ title, id }: TItem) => (
                        <Chip.Selectable key={id} onChipSelect={onTradeTypeSelect} selected={isTradeTypeSelected(id)}>
                            <Text size='sm'>{title}</Text>
                        </Chip.Selectable>
                    ))}
            <button key='trade-types-all' onClick={() => setIsOpen(true)} className='trade__trade-types-header'>
                <Text size='sm' bold underlined>
                    {<Localize i18n_default_text='View all' />}
                </Text>
            </button>
            <ActionSheet.Root isOpen={is_open} expandable={false} onClose={handleCloseTradeTypes}>
                <ActionSheet.Portal>
                    <ActionSheet.Header
                        title={<Localize i18n_default_text='Trade types' />}
                        icon={!is_editing && <Guide />}
                    />
                    <ActionSheet.Content className='mock-action-sheet--content'>
                        {is_editing ? (
                            <DraggableList
                                categories={pinned_trade_types}
                                onRightIconClick={handleRemovePinnedClick}
                                onAction={savePinnedToLocalStorage}
                                onDrag={handleOnDrag}
                            />
                        ) : (
                            <TradeTypeList
                                categories={saved_pinned_trade_types}
                                onAction={handleCustomizeTradeTypes}
                                onTradeTypeClick={handleOnTradeTypeSelect}
                                selected_item={contract_type}
                                should_show_title={false}
                                selectable
                            />
                        )}
                        <TradeTypeList
                            categories={is_editing ? other_trade_types : saved_other_trade_types}
                            onRightIconClick={is_editing ? handleAddPinnedClick : undefined}
                            onTradeTypeClick={!is_editing ? handleOnTradeTypeSelect : undefined}
                            selected_item={contract_type}
                            selectable={!is_editing}
                        />
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </div>
    );
};

export default React.memo(TradeTypes);
