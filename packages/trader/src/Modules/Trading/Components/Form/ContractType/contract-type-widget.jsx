import PropTypes from 'prop-types';
import React from 'react';
import ContractType from './contract-type.jsx';
import { findContractCategory } from '../../../Helpers/contract-type';

class ContractTypeWidget extends React.PureComponent {
    state = {
        is_dialog_open: false,
        is_info_dialog_open: false,
        list: this.props.list,
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

    onChangeInput = list => {
        this.setState({ on_input_change: true, list });
    };

    get contract_type_name() {
        const { list, value } = this.props;
        let text = findContractCategory(list, { value }).contract_types.find(item => item.value === value).text;

        // Reset Call/Reset Puts needs to be broken into 2 lines as
        // per design but we can't do that in the config because it adds
        // a space when we force into one line when used in other components.
        if (value === 'reset_call_put') {
            const text_split = text.split('/');
            text = `${text_split[0]}/\n${text_split[1]}`;
        }

        return text;
    }

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
                <ContractType.Dialog
                    is_info_dialog_open={is_info_dialog_open}
                    is_mobile={is_mobile}
                    is_open={is_dialog_open}
                    item={item || { value }}
                    list={this.props.list}
                    onBackButtonClick={this.onBackButtonClick}
                    onClose={this.handleVisibility}
                    onChangeInput={this.onChangeInput}
                >
                    {!is_info_dialog_open ? (
                        <ContractType.List
                            handleInfoClick={this.handleInfoClick}
                            handleSelect={this.handleSelect}
                            is_equal={is_equal}
                            list={list}
                            name={name}
                            value={value}
                        />
                    ) : (
                        <ContractType.Info
                            handleNavigationClick={this.handleNavigationClick}
                            handleSelect={this.handleSelect}
                            item={item || { value }}
                            list={list}
                        />
                    )}
                </ContractType.Dialog>
                <ContractType.Display
                    is_open={is_dialog_open || is_info_dialog_open}
                    name={name}
                    onClick={this.onWidgetClick}
                    value={value}
                    text={this.contract_type_name}
                />
            </div>
        );
    }
}

ContractTypeWidget.propTypes = {
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_mobile: PropTypes.bool,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
};

export default ContractTypeWidget;
