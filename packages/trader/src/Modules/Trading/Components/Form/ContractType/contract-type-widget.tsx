import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ContractType from './contract-type';
import { getContractTypeCategoryIcons, findContractCategory } from '../../../Helpers/contract-type';
import { TContractCategory, TContractType, TList } from './types';

type TContractTypeWidget = {
    name?: string;
    value: TContractType['value'];
    list: TContractCategory[];
    onChange: (event: DeepPartial<React.ChangeEvent<HTMLInputElement>>) => void;
    languageChanged?: boolean;
};

const ContractTypeWidget = ({ name, value, list, onChange, languageChanged }: TContractTypeWidget) => {
    const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
    const [is_dialog_open, setDialogVisibility] = React.useState(false);
    const [is_info_dialog_open, setInfoDialogVisibility] = React.useState(false);
    const [selected_category, setSelectedCategory] = React.useState<TList['key'] | null>(null);
    const [search_query, setSearchQuery] = React.useState('');
    const [item, setItem] = React.useState<TContractType | null>(null);

    const handleClickOutside = React.useCallback(
        (event: MouseEvent) => {
            if (isMobile()) return;
            if (wrapper_ref && !wrapper_ref.current?.contains(event.target as Node)) {
                setDialogVisibility(false);
                setInfoDialogVisibility(false);
                setItem({ ...item, value });
            }
        },
        [item, value]
    );

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleCategoryClick: React.ComponentProps<typeof ContractType.Dialog>['onCategoryClick'] = ({ key }) => {
        if (key) setSelectedCategory(key);
    };

    const handleSelect = (
        clicked_item: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => {
        const categories = list_with_category();
        const { key } = findContractCategory(categories, clicked_item);
        if ('id' in e.target && e.target.id !== 'info-icon' && clicked_item) {
            setDialogVisibility(false);
            setInfoDialogVisibility(false);
            setItem(clicked_item);
            setSelectedCategory(key);
            onChange({ target: { name, value: clicked_item.value } });
        }
    };

    const handleInfoClick = (clicked_item: TContractType) => {
        setInfoDialogVisibility(!is_info_dialog_open);

        setItem(clicked_item);
    };

    const handleVisibility = () => {
        setDialogVisibility(!is_dialog_open);
    };

    const onWidgetClick = () => {
        setDialogVisibility(!is_dialog_open);
        setInfoDialogVisibility(false);
        setItem({ ...item, value });
    };

    const onBackButtonClick = () => {
        setInfoDialogVisibility(false);
        setItem({ ...item, value });
    };

    const onChangeInput = (searchQueryItem: string) => setSearchQuery(searchQueryItem);

    const list_with_category = () => {
        const contract_type_category_icon: { [key: string]: string } = getContractTypeCategoryIcons();
        const order_arr = [
            'Accumulators',
            'Vanillas',
            'Turbos',
            'Multipliers',
            'Ups & Downs',
            'Highs & Lows',
            'Digits',
        ];
        const ordered_list = list?.sort((a, b) => order_arr.indexOf(a.key) - order_arr.indexOf(b.key));
        const accumulators_category = ordered_list?.filter(({ label }) => label === localize('Accumulators'));
        const multipliers_category = ordered_list?.filter(({ label }) => label === localize('Multipliers'));
        const options_category = ordered_list?.filter(
            ({ label }) => label !== localize('Multipliers') && label !== localize('Accumulators')
        );

        const categories: TList[] = [];

        if (list && list.length > 0) {
            categories.push({
                label: localize('All'),
                contract_categories: [...list],
                key: 'All',
                icon: '',
            });
        }

        if (multipliers_category && multipliers_category.length > 0) {
            categories.push({
                label: localize('Multipliers'),
                contract_categories: multipliers_category,
                key: 'Multipliers',
                icon: '',
            });
        }

        if (options_category && options_category.length > 0) {
            categories.push({
                label: localize('Options'),
                contract_categories: options_category,
                component: options_category.some(category => /Vanillas|Turbos/i.test(category.key)) ? (
                    <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>
                ) : null,
                key: 'Options',
                icon: '',
            });
        }

        if (accumulators_category && accumulators_category.length > 0) {
            categories.push({
                label: localize('Accumulators'),
                contract_categories: accumulators_category,
                component: <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>,
                key: 'Accumulators',
                icon: '',
            });
        }

        return categories.map(contract_category => {
            const contract_types = contract_category?.contract_categories?.reduce<TContractType[]>(
                (prev, current) => [...prev, ...current.contract_types],
                []
            );

            const icon = contract_category.key
                ? contract_type_category_icon[contract_category.key]
                : contract_category.icon;

            let contract_categories = contract_category.contract_categories;

            if (search_query) {
                contract_categories = contract_category?.contract_categories
                    ?.filter(category =>
                        category.contract_types.find(type =>
                            type.text?.toLowerCase().includes(search_query.toLowerCase())
                        )
                    )
                    .map(category => ({
                        ...category,
                        contract_types: category.contract_types.filter(type =>
                            type.text?.toLowerCase().includes(search_query.toLowerCase())
                        ),
                    }));
            }

            return {
                ...contract_category,
                contract_types,
                icon,
                contract_categories,
            };
        });
    };

    const selected_category_contracts = () => {
        const selected_list_category = list_with_category()?.find(
            categoryItem => categoryItem.key === selected_category
        );
        return (selected_list_category || list_with_category()[0]).contract_categories;
    };

    return (
        <div
            data-testid='dt_contract_widget'
            id='dt_contract_dropdown'
            className={`contract-type-widget contract-type-widget--${value} dropdown--left`}
            ref={wrapper_ref}
            tabIndex={0}
        >
            <ContractType.Display
                is_open={is_dialog_open || is_info_dialog_open}
                list={list}
                name={name ?? ''}
                onClick={onWidgetClick}
                value={value}
            />
            <ContractType.Dialog
                is_info_dialog_open={is_info_dialog_open}
                is_open={is_dialog_open}
                item={item || { value }}
                categories={list_with_category()}
                selected={selected_category || list_with_category()[0]?.key}
                onBackButtonClick={onBackButtonClick}
                onClose={handleVisibility}
                onChangeInput={onChangeInput}
                onCategoryClick={handleCategoryClick}
                show_loading={languageChanged}
            >
                {is_info_dialog_open ? (
                    <ContractType.Info
                        handleSelect={handleSelect}
                        item={item || { value }}
                        list={list_with_category()}
                    />
                ) : (
                    <ContractType.List
                        handleInfoClick={handleInfoClick}
                        handleSelect={handleSelect}
                        list={selected_category_contracts() as TContractCategory[]}
                        value={value}
                    />
                )}
            </ContractType.Dialog>
        </div>
    );
};

export default ContractTypeWidget;
