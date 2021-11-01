import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ContractType from './contract-type.jsx';
import { getContractTypeCategoryIcons } from '../../../Helpers/contract-type';

const ContractTypeWidget = ({ is_equal, name, value, list, onChange }) => {
    const wrapper_ref = React.useRef(null);
    const [is_dialog_open, setDialogVisibility] = React.useState(false);
    const [is_info_dialog_open, setInfoDialogVisibility] = React.useState(false);
    const [item, setItem] = React.useState(null);
    const [search_query, setSearchQuery] = React.useState(null);
    const [localList, setLocalList] = React.useState(list);
    const [selected_category, setSelectedCategory] = React.useState(null);

    React.useEffect(() => {
        const handleClickOutside = event => {
            if (isMobile()) return;
            if (wrapper_ref && !wrapper_ref.contains(event.target)) {
                setDialogVisibility(false);
                setInfoDialogVisibility(false);
                setItem(value);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return document.removeEventListener('mouseDown', handleClickOutside);
    }, [value]);

    React.useEffect(() => {
        if (list.length !== localList.length) {
            // reset internal list state when contracts list is changed in store (on contracts_for response)
            setLocalList(list);
        }
    }, [list, list?.length]);

    const onWidgetClick = () => {
        setDialogVisibility(!is_dialog_open);
        setInfoDialogVisibility(false);
        setItem({ value });
    };

    const list_with_category = () => {
        const contract_type_category_icon = getContractTypeCategoryIcons();
        const multipliers_category = localList.filter(
            contract_category => contract_category.label === localize('Multipliers')
        );
        const options_category = localList.filter(
            contract_category => contract_category.label !== localize('Multipliers')
        );
        const categories = [];

        if (multipliers_category.length > 0 && options_category.length > 0) {
            categories.push({
                label: localize('All'),
                contract_categories: [...localList],
            });
        }

        if (multipliers_category.length > 0) {
            categories.push({
                label: localize('Multipliers'),
                contract_categories: multipliers_category,
                component: <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>,
            });
        }

        if (options_category.length > 0) {
            categories.push({
                label: localize('Options'),
                contract_categories: options_category,
            });
        }

        return categories.map(contract_category => {
            contract_category.contract_types = contract_category.contract_categories.reduce(
                (aray, x) => [...aray, ...x.contract_types],
                []
            );
            contract_category.icon = contract_type_category_icon[contract_category.label];

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

    const onBackButtonClick = () => {
        setInfoDialogVisibility(false);
        setItem({ value });
    };

    const handleVisibility = () => {
        setDialogVisibility(!is_dialog_open);
    };

    const onChangeInput = val => setSearchQuery(val);

    const handleCategoryClick = ({ label }) => {
        setSelectedCategory(label);
    };

    const handleInfoClick = val => {
        setInfoDialogVisibility(!is_info_dialog_open);
        setItem(val);
    };

    const handleSelect = (val, e) => {
        if (e.target.id !== 'info-icon') {
            setDialogVisibility(false);
            setInfoDialogVisibility(false);
            setItem(val);

            if (item.value !== value) {
                onChange({ target: { name, value: item.value } });
            }
        }
    };

    const selected_category_contracts = () => {
        const selected_list_category = this.list_with_category.find(it => it.label === selected_category);
        return (selected_list_category || list_with_category[0]).contract_categories;
    };

    const handleNavigationClick = it => {
        setItem(it);
    };

    const selected_contract_index = () => {
        const contract_types_arr = list_with_category?.flatMap(category => category.contract_types);
        return contract_types_arr
            .filter(type => type.value !== 'rise_fall_equal')
            .findIndex(type => type.value === this.state.item?.value);
    };

    return (
        <div
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
                categories={list_with_category}
                list={localList}
                selected={selected_category || list_with_category[0]?.label}
                onBackButtonClick={onBackButtonClick}
                onClose={handleVisibility}
                onChangeInput={onChangeInput}
                onCategoryClick={handleCategoryClick}
            >
                {!is_info_dialog_open ? (
                    <ContractType.List
                        handleInfoClick={handleInfoClick}
                        handleSelect={handleSelect}
                        is_equal={is_equal}
                        list={selected_category_contracts}
                        name={name}
                        value={value}
                    />
                ) : (
                    <ContractType.Info
                        handleNavigationClick={handleNavigationClick}
                        initial_index={selected_contract_index}
                        handleSelect={handleSelect}
                        item={item || { value }}
                        list={list_with_category}
                    />
                )}
            </ContractType.Dialog>
        </div>
    );
};

ContractTypeWidget.propTypes = {
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default ContractTypeWidget;
