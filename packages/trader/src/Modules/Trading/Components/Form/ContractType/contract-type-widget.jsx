import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import Icon                from 'Assets/icon.jsx';
import ContractTypeDialog  from './contract-type-dialog.jsx';
import ContractTypeList    from './contract-type-list.jsx';
import TradeTypeInfoDialog from '../TradeTypeInfo/trade-type-info-dialog.jsx';
import TradeTypeInfoItem   from '../TradeTypeInfo/trade-type-info-item.jsx';

class ContractTypeWidget extends React.PureComponent {
    state = {
        is_dialog_open     : false,
        is_info_dialog_open: false,
        item               : {},
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = (item, e) => {
        if (item.value !== this.props.value && e.target.id !== 'info-icon') {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    };

    onSubmitButtonClick = (item) => {
        if (item.value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleInfoVisibility();
    };

    handleInfoClick = (item) => {
        this.setState({ item });
        this.handleInfoVisibility();
        this.handleVisibility();
    };

    handleNavigationClick = (item) => {
        this.setState({ item });
    };

    handleNextClick = (itemList) => {
        const navigationLength = itemList.length;
        const item = this.state.item;
        const currentIndex = itemList.findIndex((list_item) => list_item.value === item.value);
        const nextIndex = currentIndex + 1;
        if (nextIndex < navigationLength) {
            this.handleNavigationClick(itemList[nextIndex]);
        } else {
            this.handleNavigationClick(itemList[0]);
        }
    };

    handlePrevClick = (itemList) => {
        const navigationLength = itemList.length;
        const item = this.state.item;
        const currentIndex = itemList.findIndex((list_item) => list_item.value === item.value);
        const prevIndex = currentIndex - 1;
        if (prevIndex > -1) {
            this.handleNavigationClick(itemList[prevIndex]);
        } else {
            this.handleNavigationClick(itemList[navigationLength - 1]);
        }
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_dialog_open) {
            this.setState({ is_dialog_open: false });
        } else if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_info_dialog_open) {
            this.setState({
                is_dialog_open     : false,
                is_info_dialog_open: false,
            });
        }
    };

    handleInfoVisibility = () => {
        this.setState((state) => ({
            is_info_dialog_open: !state.is_info_dialog_open,
        }));
    };

    handleVisibility = () => {
        this.setState({ is_dialog_open: !this.state.is_dialog_open });
    };

    onWidgetClick = () => {
        this.setState((state) => ({ is_dialog_open: !state.is_dialog_open, is_info_dialog_open: false }));
    };

    onBackButtonClick = () => {
        this.setState((state) => ({ is_dialog_open: !state.is_dialog_open, is_info_dialog_open: false }));
    };

    getDisplayText = () => {
        const { list, value } = this.props;
        const findInArray = (arr_list) => (arr_list.find(item => item.value === value) || {}).text;
        let text = '';
        if (list) {
            Object.keys(list).some(key => {
                text = findInArray(list[key]);
                return text;
            });
        }
        return text;
    };

    getItemIndex = (curr_item, itemList) => itemList.findIndex((list_item) => list_item.value === curr_item.value);

    getItemList = () => {
        const itemList = [];
        const list = this.props.list;
        /* eslint-disable */
        Object.keys(list).map(key => {
            !['In/Out', 'Asians'].includes(key) && list[key].map(contract => {
                (contract.value !== 'rise_fall_equal') && itemList.push(contract);
            });
        });
        /* eslint-disable */
        return itemList;
    };

    render() {
        const { is_dark_theme, is_equal, is_mobile, list, name, value } = this.props;
        const { is_dialog_open, is_info_dialog_open, item }             = this.state;
        const item_list        = this.getItemList();
        const item_index       = this.getItemIndex(item, item_list);
        const item_list_length = item_list ? item_list.length : 0;
        return (
            <div
                id='dt_contract_dropdown'
                className='contract-type-widget dropdown--left'
                ref={this.setWrapperRef}
                tabIndex='0'
            >
                <div
                    className={classNames('contract-type-widget__display', {
                        'contract-type-widget__display--clicked': (is_dialog_open || is_info_dialog_open),
                    })}
                    onClick={this.onWidgetClick}
                >
                    <Icon
                        icon='IconTradeCategory'
                        category={value}
                        className='contract-type-widget__icon-wrapper'
                    />
                    <span name={name} value={value}>
                        {this.getDisplayText()}
                    </span>
                    <Icon
                        icon='IconArrow'
                        className={classNames(
                          'contract-type-widget__select-arrow',
                          'contract-type-widget__select-arrow--left')}
                    />
                </div>

                <ContractTypeDialog
                    is_mobile={is_mobile}
                    onClose={this.handleVisibility}
                    open={is_dialog_open}
                >
                    <ContractTypeList
                        handleInfoClick={this.handleInfoClick}
                        handleSelect={this.handleSelect}
                        is_equal={is_equal}
                        list={list}
                        name={name}
                        value={value}
                    />
                </ContractTypeDialog>
                <TradeTypeInfoDialog
                    is_mobile={is_mobile}
                    onClose={this.handleInfoClick}
                    open={is_info_dialog_open}
                    title={item.text}
                >
                    <TradeTypeInfoItem
                        handleNavigationClick={this.handleNavigationClick}
                        handleNextClick={this.handleNextClick}
                        handlePrevClick={this.handlePrevClick}
                        is_dark_theme={is_dark_theme}
                        is_mobile={is_mobile}
                        item={item}
                        item_index={item_index < 0 ? undefined : item_index}
                        itemList={item_list}
                        itemListLength={item_list_length}
                        onBackButtonClick={this.onBackButtonClick}
                        onSubmitButtonClick={this.onSubmitButtonClick}
                    />
                </TradeTypeInfoDialog>
            </div>
        );
    }
}

ContractTypeWidget.propTypes = {
    is_dark_theme: PropTypes.bool,
    is_equal           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_mobile: PropTypes.bool,
    list     : PropTypes.object,
    name     : PropTypes.string,
    onChange : PropTypes.func,
    value    : PropTypes.string,
};

export default ContractTypeWidget;
