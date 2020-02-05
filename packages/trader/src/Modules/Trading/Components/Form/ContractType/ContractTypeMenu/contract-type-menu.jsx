import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { VerticalTab, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchInput from './search-input.jsx';
import NoResultsMessage from './no-results-message.jsx';
import { Header } from '../ContractTypeInfo';
import { getContractCategoryLabel, getContractsList, getFilteredList } from '../../../../Helpers/contract-type';

class Dialog extends React.PureComponent {
    dialog_ref = React.createRef();
    input_ref = React.createRef();
    scrollbar_ref = React.createRef();
    vertical_tab_headers = [];
    is_user_scroll = false;

    state = {
        is_filtered_list_empty: false,
        selected: this.contract_category,
        value: this.props.item.value,
        input_value: '',
    };

    static getDerivedStateFromProps(props, state) {
        if (props.is_info_dialog_open && props.item.value !== state.value) {
            return {
                selected: {
                    label: getContractCategoryLabel(props.list, props.item),
                    value: props.item.value,
                },
            };
        }
        if (!props.is_open && !props.is_info_dialog_open && state.selected !== null) {
            return {
                selected: null, // reset selected header when dialog is closed
            };
        }
        return null;
    }

    componentDidUpdate() {
        if (this.props.is_open) {
            if (!this.vertical_tab_headers.length) {
                this.vertical_tab_headers = this.getVerticalTabHeaders();
            }
            if (this.should_scroll) {
                this.scroll();
            }
        }
    }

    onChange = e => {
        if (this.props.is_info_dialog_open) {
            this.props.onBackButtonClick();
        }
        if (this.state.input_value) {
            this.onClickClearInput();
        }
        this.setState(
            {
                selected: e,
            },
            () => {
                this.scroll();
            }
        );
    };

    onScroll = e => {
        this.is_user_scroll = true;
        const offset_top = e.target.scrollTop + 20; // add 20px of padding top and bottom
        const closest = this.vertical_tab_headers.reduce((prev, curr) => (curr.offset_top < offset_top ? curr : prev));
        if (closest !== -1) {
            this.setState({
                selected: {
                    label: closest.label,
                },
            });
        }
    };

    onScrollStop = () => {
        this.is_user_scroll = false;
    };

    onChangeInput = e => {
        this.is_user_scroll = true; // set to true to prevent calling this.scroll() when input changes
        this.setState({
            input_value: e.target.value,
        });
        const filtered_items = this.contracts_list.filter(item => item.indexOf(e.target.value.toLowerCase()) !== -1);
        this.filterList(filtered_items);
    };

    onClickClearInput = () => {
        this.input_ref.current.focus();
        this.setState({
            input_value: '',
            selected: null,
        });
        this.filterList(this.contracts_list);
    };

    filterList = filtered_items => {
        const filtered_list = getFilteredList(this.props.list, filtered_items);
        this.props.onChangeInput(filtered_list);
        this.setState({
            is_filtered_list_empty: !filtered_list.length,
            selected: filtered_list[0],
        });
    };

    getVerticalTabHeaders = () => {
        const { current } = this.dialog_ref;
        const headers = current.querySelectorAll('.dc-vertical-tab__header');
        const list_labels = current.querySelectorAll('.contract-type-list__label');

        return [...list_labels].map((label, i) => ({
            label: label.innerText,
            offset_top: label.offsetTop - headers[i].offsetTop + 40,
        }));
    };

    scroll() {
        this.scrollbar_ref.current.scrollTop(this.offset_top); // scroll to selected contract category label
    }

    get contracts_list() {
        return getContractsList(this.props.list);
    }

    get contract_category() {
        const { list, item } = this.props;
        const label = getContractCategoryLabel(list, item);

        return {
            label,
        };
    }

    get selected() {
        return this.state.selected || this.contract_category;
    }

    get offset_top() {
        return this.vertical_tab_headers.find(header => header.label === this.selected.label).offset_top;
    }

    get should_scroll() {
        if (!this.state.selected) return true;
        if (!this.scrollbar_ref.current || this.is_user_scroll) return false;

        return this.offset_top !== Math.ceil(this.scrollbar_ref.current.getScrollTop());
    }

    render() {
        const { children, is_info_dialog_open, is_open, item, list, onBackButtonClick } = this.props;

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
                    <div ref={this.dialog_ref} className='contract-type-dialog__wrapper'>
                        <VerticalTab.Layout>
                            <VerticalTab.Headers
                                header_title={localize('Trade types')}
                                items={list}
                                selected={this.selected}
                                onChange={this.onChange}
                            />
                            <div className='dc-vertical-tab__content'>
                                <div className='dc-vertical-tab__action-bar'>{action_bar_items}</div>
                                <div className='dc-vertical-tab__content-container'>
                                    {this.state.is_filtered_list_empty && (
                                        <NoResultsMessage text={this.state.input_value} />
                                    )}
                                    {!is_info_dialog_open ? (
                                        <ThemedScrollbars
                                            list_ref={this.scrollbar_ref}
                                            onScroll={this.onScroll}
                                            onScrollStop={this.onScrollStop}
                                            renderView={props => (
                                                <div style={{ paddingBottom: '50vh', ...props.style }} />
                                            )}
                                        >
                                            {children}
                                        </ThemedScrollbars>
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
