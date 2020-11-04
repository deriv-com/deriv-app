import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { VerticalTab, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchInput from './search-input.jsx';
import NoResultsMessage from './no-results-message.jsx';
import { Header } from '../ContractTypeInfo';
import { getContractCategoryLabel } from '../../../../Helpers/contract-type';

class Dialog extends React.PureComponent {
    input_ref = React.createRef();

    state = {
        input_value: '',
    };

    onChange = e => {
        if (this.props.is_info_dialog_open) {
            this.props.onBackButtonClick();
        }
        if (this.state.input_value) {
            this.onClickClearInput();
        }
        if (this.props.onCategoryClick) {
            this.props.onCategoryClick(e);
        }
    };

    onChangeInput = e => {
        this.setState({
            input_value: e.target.value,
        });
        this.props.onChangeInput(e.target.value);
    };

    onClickClearInput = () => {
        this.input_ref.current.focus();
        this.setState({ input_value: '' });
        this.props.onChangeInput('');
    };

    get contract_category() {
        const { categories, item } = this.props;
        const label = getContractCategoryLabel(categories, item);

        return {
            label,
        };
    }

    get selected() {
        const { selected } = this.props;
        return selected ? { label: selected } : this.contract_category;
    }

    get selected_category_contract() {
        const { categories } = this.props;
        return !categories.find(category => category.label === this.selected.label).contract_categories.length;
    }

    render() {
        const { children, is_info_dialog_open, is_open, item, categories, onBackButtonClick } = this.props;

        const action_bar_items = is_info_dialog_open ? (
            <Header title={item.text} onClickGoBack={onBackButtonClick} />
        ) : (
            <SearchInput
                ref={this.input_ref}
                onChange={this.onChangeInput}
                onClickClearInput={this.onClickClearInput}
                value={this.state.input_value}
            />
        );

        return (
            <CSSTransition
                in={is_open}
                timeout={100}
                classNames={{
                    enter: 'contract-type-dialog--enter',
                    enterDone: 'contract-type-dialog--enterDone',
                    exit: 'contract-type-dialog--exit',
                }}
                unmountOnExit
            >
                <div className='contract-type-dialog'>
                    <div className='contract-type-dialog__wrapper'>
                        <VerticalTab.Layout>
                            <VerticalTab.Headers
                                header_title={localize('Trade types')}
                                items={categories}
                                selected={this.selected}
                                onChange={this.onChange}
                            />
                            <div className='dc-vertical-tab__content'>
                                <div className='dc-vertical-tab__action-bar'>{action_bar_items}</div>
                                <div className='dc-vertical-tab__content-container'>
                                    {this.selected_category_contract && (
                                        <NoResultsMessage text={this.state.input_value} />
                                    )}
                                    {!is_info_dialog_open ? (
                                        <ThemedScrollbars height='calc(100vh - 172px)'>{children}</ThemedScrollbars>
                                    ) : (
                                        children
                                    )}
                                </div>
                            </div>
                        </VerticalTab.Layout>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

Dialog.propTypes = {
    is_info_dialog_open: PropTypes.bool,
    is_open: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onBackButtonClick: PropTypes.func,
    onChangeInput: PropTypes.func,
};

export default Dialog;
