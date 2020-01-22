import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { Icon }            from '@deriv/components';
import IconTradeCategory   from 'Assets/Trading/Categories/icon-trade-categories.jsx';
import ContractTypeDialog  from './contract-type-dialog.jsx';
import ContractTypeInfo    from './contract-type-info.jsx';
import ContractTypeList    from './contract-type-list.jsx';

class ContractTypeWidget extends React.PureComponent {
    state = {
        is_dialog_open     : false,
        is_info_dialog_open: false,
        list               : this.props.list,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = ({ value }, e) => {
        if (e.target.id !== 'info-icon') {
            this.setState({
                is_dialog_open     : false,
                is_info_dialog_open: false,
            }, () => {
                if (value !== this.props.value) {
                    this.props.onChange({ target: { name: this.props.name, value } });
                }
            });
        }
    };

    handleInfoClick = (item) => {
        this.setState(state => ({
            is_info_dialog_open: !state.is_info_dialog_open,
            item,
        }));
    };

    handleNavigationClick = (item) => {
        this.setState({ item });
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            this.setState({
                is_dialog_open     : false,
                is_info_dialog_open: false,
                item               : { value: this.props.value },
            });
        }
    };

    handleVisibility = () => {
        this.setState(state => ({ is_dialog_open: !state.is_dialog_open }));
    };

    onWidgetClick = () => {
        this.setState(state => ({
            is_dialog_open     : !state.is_dialog_open,
            is_info_dialog_open: false,
        }));
    };

    onBackButtonClick = () => {
        this.setState({ is_info_dialog_open: false, item: { value: this.props.value } });
    };

    onChangeInput = (list) => {
        this.setState({ list });
    }

    getDisplayText = () => {
        const { list, value } = this.props;
        const findInArray = (arr_list) => (arr_list.find(item => item.value === value) || {}).text;
        let text = '';
        if (list) {
            Object.keys(list).some(key => {
                text = findInArray(list[key].contract_types);
                return text;
            });
        }
        return text;
    };
    
    render() {
        const { is_equal, is_mobile, name, value } = this.props;
        const { is_dialog_open, is_info_dialog_open, item, list } = this.state;

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
                    <IconTradeCategory
                        category={value}
                        className='contract-type-widget__icon-wrapper'
                    />
                    <span name={name} value={value}>
                        {this.getDisplayText()}
                    </span>
                    <Icon
                        icon='IcChevronDown'
                        className={classNames(
                            'contract-type-widget__select-arrow',
                            'contract-type-widget__select-arrow--left')}
                    />
                </div>
                <ContractTypeDialog
                    is_info_dialog_open={is_info_dialog_open}
                    is_mobile={is_mobile}
                    is_open={is_dialog_open}
                    item={item || { value }}
                    list={this.props.list}
                    onBackButtonClick={this.onBackButtonClick}
                    onClose={this.handleVisibility}
                    onChangeInput={this.onChangeInput}
                >
                    {!is_info_dialog_open ?
                        <ContractTypeList
                            handleInfoClick={this.handleInfoClick}
                            handleSelect={this.handleSelect}
                            is_equal={is_equal}
                            list={list}
                            name={name}
                            value={value}
                        />
                        :
                        <ContractTypeInfo
                            handleNavigationClick={this.handleNavigationClick}
                            handleSelect={this.handleSelect}
                            item={item || { value }}
                            list={list}
                        />
                    }
                </ContractTypeDialog>
            </div>
        );
    }
}

ContractTypeWidget.propTypes = {
    is_equal: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_mobile: PropTypes.bool,
    list     : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.string,
};

export default ContractTypeWidget;
