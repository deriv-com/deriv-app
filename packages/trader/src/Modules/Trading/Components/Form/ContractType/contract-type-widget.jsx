import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ContractType from './contract-type.jsx';
import { getContractTypeCategoryIcons, findContractCategory } from '../../../Helpers/contract-type';

const ContractTypeWidget = ({ is_equal, name, value, list, onChange, languageChanged }) => {
    const wrapper_ref = React.useRef(null);
    const [is_dialog_open, setDialogVisibility] = React.useState(false);
    const [is_info_dialog_open, setInfoDialogVisibility] = React.useState(false);
    const [selected_category, setSelectedCategory] = React.useState(null);
    const [search_query, setSearchQuery] = React.useState('');
    const [item, setItem] = React.useState(null);
    const [selected_item, setSelectedItem] = React.useState(null);

    const handleClickOutside = React.useCallback(
        event => {
            if (isMobile()) return;
            if (wrapper_ref && !wrapper_ref.current?.contains(event.target)) {
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

    const handleCategoryClick = ({ key }) => {
        setSelectedCategory(key);
    };

    const handleSelect = (clicked_item, e) => {
        const categories = list_with_category();
        const { key } = findContractCategory(categories, clicked_item);
        if (e.target.id !== 'info-icon') {
            setDialogVisibility(false);
            setInfoDialogVisibility(false);
            setItem(clicked_item);
            setSelectedItem(clicked_item);
            setSelectedCategory(key);
        }
    };

    React.useEffect(() => {
        if (selected_item && selected_item.value !== value) {
            onChange({ target: { name, value: selected_item.value } });
        }
    }, [selected_item, onChange, name, value]);

    const handleInfoClick = clicked_item => {
        setInfoDialogVisibility(!is_info_dialog_open);

        setItem(clicked_item);
    };

    const handleNavigationClick = nav_clicked_item => {
        setItem(nav_clicked_item);
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

    const onChangeInput = searchQueryItem => setSearchQuery(searchQueryItem);

    const list_with_category = () => {
        const contract_type_category_icon = getContractTypeCategoryIcons();

        // Order the list based on categories provided in order_arr
        const order_arr = ['Vanillas', 'Ups & Downs', 'Highs & Lows', 'Digits'];
        const ordered_list = list.sort((a, b) => order_arr.indexOf(a.key) - order_arr.indexOf(b.key));

        const multipliers_category = ordered_list.filter(
            contract_category => contract_category.label === localize('Multipliers')
        );
        const options_category = ordered_list.filter(
            contract_category => contract_category.label !== localize('Multipliers')
        );

        const categories = [];

        if (multipliers_category.length > 0 && options_category.length > 0) {
            categories.push({
                label: localize('All'),
                contract_categories: [...ordered_list],
                key: 'All',
            });
        }

        if (multipliers_category.length > 0) {
            categories.push({
                label: localize('Multipliers'),
                contract_categories: multipliers_category,
                component: <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>,
                key: 'Multipliers',
            });
        }

        if (options_category.length > 0) {
            categories.push({
                label: localize('Options'),
                contract_categories: options_category,
                key: 'Options',
            });
        }

        return categories.map(contract_category => {
            contract_category.contract_types = contract_category.contract_categories.reduce(
                (aray, x) => [...aray, ...x.contract_types],
                []
            );
            contract_category.icon = contract_type_category_icon[contract_category.key];

            if (search_query) {
                contract_category.contract_categories = contract_category.contract_categories
                    .filter(category =>
                        category.contract_types.find(type =>
                            type.text.toLowerCase().includes(search_query.toLowerCase())
                        )
                    )
                    .map(category => ({
                        ...category,
                        contract_types: category.contract_types.filter(type =>
                            type.text.toLowerCase().includes(search_query.toLowerCase())
                        ),
                    }));
            }

            return contract_category;
        });
    };

    const selected_category_contracts = () => {
        const selected_list_category = list_with_category()?.find(
            categoryItem => categoryItem.key === selected_category
        );
        return (selected_list_category || list_with_category()[0]).contract_categories;
    };

    const selected_contract_index = () => {
        const contract_types_arr = list_with_category()?.flatMap(category => category.contract_types);
        return contract_types_arr
            .filter(type => type.value !== 'rise_fall_equal')
            .findIndex(type => type.value === item?.value);
    };
    return (
        <div
            data-testid='dt_contract_widget'
            id='dt_contract_dropdown'
            className={`contract-type-widget contract-type-widget--${value} dropdown--left`}
            ref={wrapper_ref}
            tabIndex='0'
        >
            <ContractType.Display
                is_open={is_dialog_open || is_info_dialog_open}
                list={list}
                name={name}
                onClick={onWidgetClick}
                value={value}
            />
            <ContractType.Dialog
                is_info_dialog_open={is_info_dialog_open}
                is_open={is_dialog_open}
                item={item || { value }}
                categories={list_with_category()}
                list={list}
                selected={selected_category || list_with_category()[0]?.key}
                onBackButtonClick={onBackButtonClick}
                onClose={handleVisibility}
                onChangeInput={onChangeInput}
                onCategoryClick={handleCategoryClick}
                show_loading={languageChanged}
            >
                {is_info_dialog_open ? (
                    <ContractType.Info
                        handleNavigationClick={handleNavigationClick}
                        initial_index={selected_contract_index()}
                        handleSelect={handleSelect}
                        item={item || { value }}
                        list={list_with_category()}
                    />
                ) : (
                    <ContractType.List
                        handleInfoClick={handleInfoClick}
                        handleSelect={handleSelect}
                        is_equal={is_equal}
                        list={selected_category_contracts()}
                        name={name}
                        value={value}
                    />
                )}
            </ContractType.Dialog>
        </div>
    );
};

ContractTypeWidget.propTypes = {
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    languageChanged: PropTypes.bool,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default ContractTypeWidget;
