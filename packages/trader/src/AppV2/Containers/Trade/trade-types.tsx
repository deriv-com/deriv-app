import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Chip, Text, ActionSheet } from '@deriv-com/quill-ui';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';
import { Localize, localize } from '@deriv/translations';

type TTradeTypesProps = {
    onTradeTypeSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    trade_types: ReturnType<typeof getTradeTypesList>;
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

    const handleAddPinnedClick = (item: TItem) => {
        setOtherTradeTypes(prev_categories =>
            prev_categories.map(category => ({
                ...category,
                items: category.items.filter(i => i.id !== item.id).sort((a, b) => a.title?.localeCompare(b.title)),
            }))
        );
        setPinnedTradeTypes(prev_pinned => {
            const updated_pinned = [...prev_pinned];
            const pinned_category = updated_pinned.find(cat => cat.id === 'pinned');

            if (pinned_category) {
                pinned_category.items.push(item);
            } else {
                updated_pinned.push({
                    id: 'pinned',
                    title: localize('Pinned'),
                    items: [item],
                });
            }

            return updated_pinned;
        });
    };

    const handleRemovePinnedClick = (item: TItem) => {
        setPinnedTradeTypes(prev_categories =>
            prev_categories.map(category => ({
                ...category,
                items: category.items.filter(i => i.id !== item.id),
            }))
        );
        setOtherTradeTypes(prev_others => {
            const updated_others = [...prev_others];
            const other_category = updated_others.find(cat => cat.id === 'other');

            if (other_category) {
                other_category.items.unshift(item);
            } else {
                updated_others.push({
                    id: 'other',
                    items: [item],
                });
            }

            updated_others.map(category => ({
                ...category,
                items: category.items.sort((a, b) => a.title?.localeCompare(b.title)),
            }));

            return updated_others;
        });
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
                    .filter(
                        item => !default_pinned_trade_types[0]?.items.some(pinned_item => pinned_item.id === item.id)
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
        setIsOpen(false);
    };

    const handleOnDrag = (categories: TResultItem[]) => {
        setPinnedTradeTypes(categories);
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
            <a key='trade-types-all' onClick={() => setIsOpen(true)} className='trade__trade-types-header'>
                <Text size='sm' bold underlined>
                    {<Localize i18n_default_text='View all' />}
                </Text>
            </a>
            <ActionSheet.Root isOpen={is_open} expandable={false} onClose={handleCloseTradeTypes}>
                <ActionSheet.Portal>
                    <ActionSheet.Header title={<Localize i18n_default_text='Trade types' />} />
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
                                onAction={() => setIsEditing(true)}
                                onTradeTypeClick={onTradeTypeSelect}
                                selected_item={contract_type}
                                should_show_title={false}
                                selectable
                            />
                        )}
                        <TradeTypeList
                            categories={is_editing ? other_trade_types : saved_other_trade_types}
                            onRightIconClick={is_editing ? handleAddPinnedClick : undefined}
                            onTradeTypeClick={!is_editing ? onTradeTypeSelect : undefined}
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
