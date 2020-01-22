import PropTypes    from 'prop-types';
import React        from 'react';
import ContractType from './contract-type.jsx';

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

    handleSelect = (item, e) => {
        if (e.target.id !== 'info-icon') {
            this.setState({
                is_dialog_open     : false,
                is_info_dialog_open: false,
                item,
            }, () => {
                if (item.value !== this.props.value) {
                    this.props.onChange({ target: { name: this.props.name, value: item.value } });
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
            item               : { value: this.props.value },
        }));
    };

    onBackButtonClick = () => {
        this.setState({ is_info_dialog_open: false, item: { value: this.props.value } });
    };

    onChangeInput = (list) => {
        this.setState({ list });
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
                <ContractType.Display
                    is_open={is_dialog_open || is_info_dialog_open}
                    list={this.props.list}
                    name={name}
                    onClick={this.onWidgetClick}
                    value={value}
                />
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
                    {!is_info_dialog_open ?
                        <ContractType.List
                            handleInfoClick={this.handleInfoClick}
                            handleSelect={this.handleSelect}
                            is_equal={is_equal}
                            list={list}
                            name={name}
                            value={value}
                        />
                        :
                        <ContractType.Info
                            handleNavigationClick={this.handleNavigationClick}
                            handleSelect={this.handleSelect}
                            item={item || { value }}
                            list={list}
                        />
                    }
                </ContractType.Dialog>
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
