import PropTypes              from 'prop-types';
import React                  from 'react';
import { CSSTransition }      from 'react-transition-group';
import { ThemedScrollbars }   from '@deriv/components';
import {
    VerticalTabHeaders,
    VerticalTabLayout }       from 'App/Components/Elements/VerticalTabs';
import { localize }           from '@deriv/translations';
import SearchInput            from './search-input.jsx';
import NoResultsMessage       from './no-results-message.jsx';
import { Header }             from '../ContractTypeInfo';
import {
    getContractCategoryLabel,
    getContractsList,
    getFilteredList }         from '../../../../Helpers/contract-type';

class Dialog extends React.PureComponent {
    dialog_ref           = React.createRef();
    scrollbar_ref        = React.createRef();
    vertical_tab_headers = [];

    state = {
        is_filtered_list_empty: false,
        selected              : this.contract_category_label,
        value                 : this.props.item.value,
        input_value           : '',
    };

    componentDidUpdate() {
        const {
            is_info_dialog_open,
            is_open,
            item,
        } = this.props;

        if (is_open && !this.vertical_tab_headers.length) {
            this.vertical_tab_headers = this.getVerticalTabHeaders();
        }
        if (item.value !== this.state.value) {
            // sync selected vertical tab header with contract type value
            this.setState({
                selected: this.contract_category_label,
                value   : item.value,
            }, () => {
                if (is_open && !is_info_dialog_open) {
                    this.scroll();
                }
            });
        }
        if (!is_open && !is_info_dialog_open && this.state.selected !== null) {
            // reset selected vertical tab header when dialog is closed
            this.setState({ selected: null });
        }
        if (!this.state.selected && this.scrollbar_ref.current) {
            this.scroll();
        }
    }

    onChange = (e) => {
        if (this.props.is_info_dialog_open) {
            this.props.onBackButtonClick();
        }
        this.setState({
            selected: e,
        }, () => {
            this.scroll();
        });
    }

    onScroll = (e) => {
        const offset_top = e.target.scrollTop + 20; // add 20px of padding top and bottom
        const closest = this.vertical_tab_headers.reduce((prev, curr) => curr.offset_top < offset_top ? curr : prev);
        if (closest !== -1) {
            this.setState({
                selected: {
                    label: closest.label,
                },
            });
        }
    }

    onChangeInput = (e) => {
        this.setState({
            input_value: e.target.value,
        });
        const filtered_items = this.contracts_list.filter(item => item.indexOf(e.target.value.toLowerCase()) !== -1);
        this.filterList(filtered_items);
    }

    onClickClearInput = () => {
        this.setState({
            input_value: '',
            selected   : null,
        });
        this.filterList(this.contracts_list);
    }

    filterList = (filtered_items) => {
        const filtered_list = getFilteredList(this.props.list, filtered_items);
        this.props.onChangeInput(filtered_list);
        this.setState({ is_filtered_list_empty: !filtered_list.length });
    }

    getVerticalTabHeaders = () => {
        const { current } = this.dialog_ref;
        const headers     = current.querySelectorAll('.vertical-tab__header');
        const list_labels = current.querySelectorAll('.contract-type-list__label');

        return [...list_labels].map((label, i) => (
            {
                label     : label.innerText,
                offset_top: label.offsetTop - headers[i].offsetTop + 40,
            }
        ));
    }

    scroll() {
        this.scrollbar_ref.current.scrollTop(this.offset_top); // scroll to selected contract category label
    }

    get contracts_list() {
        return getContractsList(this.props.list);
    }

    get contract_category_label() {
        const { list, item } = this.props;
        const label = getContractCategoryLabel(list, item);

        return {
            label,
        };
    }

    get selected() {
        return this.state.selected || this.contract_category_label;
    }

    get offset_top() {
        return this.vertical_tab_headers.filter(header => header.label === this.selected.label)[0].offset_top;
    }

    render() {
        const {
            children,
            is_info_dialog_open,
            is_open,
            item,
            list,
            onBackButtonClick,
        } = this.props;

        const action_bar_items = is_info_dialog_open ?
            <Header
                title={item.text}
                onClickGoBack={onBackButtonClick}
            />
            :
            <SearchInput
                onChange={this.onChangeInput}
                onClickClearInput={this.onClickClearInput}
                value={this.state.input_value}
            />;

        return (
            <CSSTransition
                in={is_open}
                timeout={100}
                classNames={{
                    enter    : 'contract-type-dialog--enter',
                    enterDone: 'contract-type-dialog--enterDone',
                    exit     : 'contract-type-dialog--exit',
                }}
                unmountOnExit
            >
                <div className='contract-type-dialog'>
                    <div
                        ref={this.dialog_ref}
                        className='contract-type-dialog__wrapper'
                    >
                        <VerticalTabLayout>
                            <VerticalTabHeaders
                                header_title={localize('Trade types')}
                                items={list}
                                selected={this.selected}
                                onChange={this.onChange}
                            />
                            <div className='vertical-tab__content'>
                                <div className='vertical-tab__action-bar'>
                                    {action_bar_items}
                                </div>
                                <div className='vertical-tab__content-container'>
                                    {this.state.is_filtered_list_empty &&
                                        <NoResultsMessage text={this.state.input_value} />
                                    }
                                    {!is_info_dialog_open ?
                                        <ThemedScrollbars
                                            list_ref={this.scrollbar_ref}
                                            onScroll={this.onScroll}
                                            renderView={props => <div style={{ paddingBottom: '50vh', ...props.style }} />}
                                        >
                                            {children}
                                        </ThemedScrollbars>
                                        :
                                        children
                                    }
                                </div>
                            </div>
                        </VerticalTabLayout>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

Dialog.propTypes = {
    is_info_dialog_open: PropTypes.bool,
    is_open            : PropTypes.bool,
    item               : PropTypes.object,
    list               : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    onBackButtonClick: PropTypes.func,
    onChangeInput    : PropTypes.func,
};

export default Dialog;
