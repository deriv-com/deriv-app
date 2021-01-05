import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ContractType from './contract-type.jsx';
import { getContractTypeCategoryIcons } from '../../../Helpers/contract-type';

class ContractTypeWidget extends React.PureComponent {
    state = {
        is_dialog_open: false,
        is_info_dialog_open: false,
        list: this.props.list,
        selected_category: null,
        search_query: '',
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate() {
        if (this.props.list.length !== this.state.list.length && !this.state.on_input_change) {
            // reset internal list state when contracts list is changed in store (on contracts_for response)
            this.setState({ list: this.props.list });
        }
    }

    handleCategoryClick = ({ label }) => this.setState({ selected_category: label });

    handleSelect = (item, e) => {
        if (e.target.id !== 'info-icon') {
            this.setState(
                {
                    is_dialog_open: false,
                    is_info_dialog_open: false,
                    item,
                },
                () => {
                    if (item.value !== this.props.value) {
                        this.props.onChange({ target: { name: this.props.name, value: item.value } });
                    }
                }
            );
        }
    };

    handleInfoClick = item => {
        this.setState(state => ({
            is_info_dialog_open: !state.is_info_dialog_open,
            item,
        }));
    };

    handleNavigationClick = item => {
        this.setState({ item });
    };

    setWrapperRef = node => {
        this.wrapper_ref = node;
    };

    handleClickOutside = event => {
        if (isMobile()) return;
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            this.setState({
                is_dialog_open: false,
                is_info_dialog_open: false,
                item: { value: this.props.value },
            });
        }
    };

    handleVisibility = () => {
        this.setState(state => ({ is_dialog_open: !state.is_dialog_open }));
    };

    onWidgetClick = () => {
        this.setState(state => ({
            is_dialog_open: !state.is_dialog_open,
            is_info_dialog_open: false,
            item: { value: this.props.value },
        }));
    };

    onBackButtonClick = () => {
        this.setState({ is_info_dialog_open: false, item: { value: this.props.value } });
    };

    onChangeInput = search_query => this.setState({ search_query });

    get list_with_category() {
        const { list, search_query } = this.state;
        const contract_type_category_icon = getContractTypeCategoryIcons();
        const multipliers_category = list.filter(
            contract_category => contract_category.label === localize('Multipliers')
        );
        const options_category = list.filter(contract_category => contract_category.label !== localize('Multipliers'));

        const categories = [];

        if (multipliers_category.length > 0 && options_category.length > 0) {
            categories.push({
                label: localize('All'),
                contract_categories: [...list],
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
    }

    get selected_category_contracts() {
        const { selected_category } = this.state;
        const selected_list_category = this.list_with_category.find(item => item.label === selected_category);
        return (selected_list_category || this.list_with_category[0]).contract_categories;
    }

    get selected_contract_index() {
        const contract_types_arr = this.list_with_category?.flatMap(category => category.contract_types);
        return contract_types_arr
            .filter(type => type.value !== 'rise_fall_equal')
            .findIndex(type => type.value === this.state.item?.value);
    }

    render() {
        const { is_equal, name, value } = this.props;
        const { is_dialog_open, is_info_dialog_open, item, list } = this.state;

        return (
            <div
                id='dt_contract_dropdown'
                className={`contract-type-widget contract-type-widget--${value} dropdown--left`}
                ref={this.setWrapperRef}
                tabIndex='0'
            >
                <ContractType.Display
                    is_open={is_dialog_open || is_info_dialog_open}
                    list={this.props.list}
                    name={name}
                    onClick={this.onWidgetClick}
                    value={value}
                />
                <ContractType.Dialog
                    is_info_dialog_open={is_info_dialog_open}
                    is_open={is_dialog_open}
                    item={item || { value }}
                    categories={this.list_with_category}
                    list={list}
                    selected={this.state.selected_category || this.list_with_category[0].label}
                    onBackButtonClick={this.onBackButtonClick}
                    onClose={this.handleVisibility}
                    onChangeInput={this.onChangeInput}
                    onCategoryClick={this.handleCategoryClick}
                >
                    {!is_info_dialog_open ? (
                        <ContractType.List
                            handleInfoClick={this.handleInfoClick}
                            handleSelect={this.handleSelect}
                            is_equal={is_equal}
                            list={this.selected_category_contracts}
                            name={name}
                            value={value}
                        />
                    ) : (
                        <ContractType.Info
                            handleNavigationClick={this.handleNavigationClick}
                            initial_index={this.selected_contract_index}
                            handleSelect={this.handleSelect}
                            item={item || { value }}
                            list={this.list_with_category}
                        />
                    )}
                </ContractType.Dialog>
            </div>
        );
    }
}

ContractTypeWidget.propTypes = {
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default ContractTypeWidget;
