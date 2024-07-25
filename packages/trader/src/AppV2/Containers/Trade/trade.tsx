import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import BottomNav from 'AppV2/Components/BottomNav';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { useTraderStore } from 'Stores/useTraderStores';
import { Localize } from '@deriv/translations';

const Trade = observer(() => {
    const { contract_types_list, onMount, onUnmount } = useTraderStore();

    type TCategory = {
        text: string;
        value: string;
    };

    type TItem = {
        id: string;
        title: string;
        icon?: React.ReactNode;
    };

    type TDataObject = {
        [key: string]: {
            categories: TCategory[];
        };
    };

    type TResultItem = {
        id: string;
        title?: string;
        button_title?: string;
        onButtonClick?: () => void;
        items: TItem[];
    };

    const createArrayFromCategories = (data: TDataObject): TItem[] => {
        const result: TItem[] = [];
        let id_counter = 1;

        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key].categories) {
                data[key].categories.forEach(category => {
                    result.push({
                        id: id_counter.toString(),
                        title: category.text,
                    });
                    id_counter++;
                });
            }
        }

        return result;
    };

    const [other_trade_types, setOtherTradeTypes] = React.useState<TResultItem[]>([]);
    const [pinned_trade_types, setPinnedTradeTypes] = React.useState<TResultItem[]>([]);

    const [open, setOpen] = React.useState<boolean>();

    const handleOpenTradeTypes = () => {
        const saved_other_trade_types = localStorage.getItem('other_trade_types');
        const saved_pinned_trade_types = localStorage.getItem('pinned_trade_types');

        if (saved_other_trade_types) {
            setOtherTradeTypes(JSON.parse(saved_other_trade_types));
        }

        if (saved_pinned_trade_types) {
            setPinnedTradeTypes(JSON.parse(saved_pinned_trade_types));
        }

        setOpen(true);
    };

    const handleAddPinnedClick = (item: TItem) => {
        setOtherTradeTypes(prev_categories =>
            prev_categories.map(category => ({
                ...category,
                items: category.items.filter(i => i.id !== item.id).sort((a, b) => a.title.localeCompare(b.title)),
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
                    title: 'Pinned',
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
                items: category.items.sort((a, b) => a.title.localeCompare(b.title)),
            }));

            return updated_others;
        });
    };

    React.useEffect(() => {
        const formatted_items = createArrayFromCategories(contract_types_list);

        setOtherTradeTypes([
            {
                id: 'other',
                items: formatted_items
                    .filter(item => !pinned_trade_types[0]?.items.some(pinned_item => pinned_item.id === item.id))
                    .sort((a, b) => a.title.localeCompare(b.title)),
            },
        ]);
    }, [contract_types_list]);

    React.useEffect(() => {
        const saved_other_trade_types = localStorage.getItem('other_trade_types');
        const saved_pinned_trade_types = localStorage.getItem('pinned_trade_types');

        onMount();

        if (saved_other_trade_types) {
            setOtherTradeTypes(JSON.parse(saved_other_trade_types));
        }

        if (saved_pinned_trade_types) {
            setPinnedTradeTypes(JSON.parse(saved_pinned_trade_types));
        }

        return () => {
            onUnmount();
        };
    }, []);

    const savePinnedToLocalStorage = () => {
        localStorage.setItem('pinned_trade_types', JSON.stringify(pinned_trade_types));
        localStorage.setItem('other_trade_types', JSON.stringify(other_trade_types));
        setOpen(false);
    };

    const handleOnDrag = (categories: TResultItem[]) => {
        setPinnedTradeTypes(categories);
    };

    return (
        <BottomNav className='trade-page'>
            <ActionSheet.Root isOpen={open} onOpen={handleOpenTradeTypes} expandable={false}>
                <ActionSheet.Trigger label='Edit Trade Types' />
                <ActionSheet.Portal>
                    <ActionSheet.Header title={<Localize i18n_default_text='Trade types' />} />
                    <ActionSheet.Content className='mock-action-sheet--content'>
                        <DraggableList
                            categories={pinned_trade_types}
                            onRightIconClick={handleRemovePinnedClick}
                            onSave={savePinnedToLocalStorage}
                            onDrag={handleOnDrag}
                        />
                        <TradeTypeList categories={other_trade_types} onRightIconClick={handleAddPinnedClick} />
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </BottomNav>
    );
});

export default Trade;
