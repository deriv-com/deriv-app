import PropTypes              from 'prop-types';
import React                  from 'react';
import { CSSTransition }      from 'react-transition-group';
import { ThemedScrollbars }   from '@deriv/components';
import {
    VerticalTabHeaders,
    VerticalTabLayout }       from 'App/Components/Elements/VerticalTabs';
import { localize }           from '@deriv/translations';
import {
    ContractTypeInfoHeader,
    MemoizedSearchInput,
    NoResultsFound }          from './action-bar-items.jsx';
import MobileDialog           from '../../Elements/mobile-dialog.jsx';
import {
    getContractCategoryLabel,
    getContractsList,
    getFilteredList }         from '../../../Helpers/contract-type';

class Dialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_filtered_list_empty: false,
            selected              : this.contract_category_label,
            value                 : this.props.item.value,
            input_value           : '',
        };
        this.dialog_ref      = React.createRef();
        this.scrollbar_ref   = React.createRef();
        this.labels_list     = [];
        this.offset_top_list = [];
        this.contracts_list  = getContractsList(this.props.list);
    }

    componentDidUpdate() {
        const {
            is_info_dialog_open,
            is_open,
            item,
        } = this.props;

        if (is_open && !this.labels_list.length) {
            const headers        = this.dialog_ref.current.querySelectorAll('.vertical-tab__header');
            this.labels_list     = this.dialog_ref.current.querySelectorAll('.contract-type-list__label');
            this.offset_top_list = this.labels.map((label, i) => label.offsetTop - headers[i].offsetTop + 40);
        }
        if (item.value !== this.state.value) {
            this.setState({
                selected: this.contract_category_label,
                value   : item.value,
            });
        }
        if (!is_open && !is_info_dialog_open && this.state.selected !== null) {
            this.setState({ selected: null });
        }
    }

    onChange = (e) => {
        if (this.props.is_info_dialog_open) {
            this.props.onBackButtonClick();
        }
        this.setState({
            selected: e,
        }, () => {
            const idx = this.labels.findIndex(n => n.innerText === e.label);
            this.scrollbar_ref.current.scrollTop(this.offset_top_list[idx]);
        });
    }

    onScroll = (e) => {
        const offset_top = e.target.scrollTop + 20; // add 20px of padding top and bottom
        const closest    = this.offset_top_list.reduce((prev, curr) => curr < offset_top ? curr : prev);
        const idx        = this.offset_top_list.indexOf(closest);
        if (idx !== -1) {
            this.setState({
                selected: {
                    label: this.labels[idx].innerText,
                },
            });
        }
    }

    onChangeInput = (e) => {
        this.setState({
            input_value: e.target.value,
        });
        const filtered_items = this.contracts_list.filter(l => l.indexOf(e.target.value.toLowerCase()) !== -1);
        this.filterList(filtered_items);
    }

    onClickClearInput = () => {
        this.setState({
            input_value           : '',
            is_filtered_list_empty: false,
        });
        this.filterList(this.contracts_list);
    }

    filterList = (filtered_items) => {
        this.scrollbar_ref.current.scrollTop(0);
        const filtered_list = getFilteredList(this.props.list, filtered_items);
        this.setState({
            is_filtered_list_empty: !filtered_list.length,
        }, () => {
            this.props.onChangeInput(filtered_list);
        });
    }

    get labels() {
        return [...this.labels_list];
    }

    get contract_category_label() {
        const { list, item } = this.props;
        const label = getContractCategoryLabel(list, item);

        return {
            label,
        };
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
            <ContractTypeInfoHeader
                item={item}
                onBackButtonClick={onBackButtonClick}
            />
            :
            <MemoizedSearchInput
                onChange={this.onChangeInput}
                onClickClearInput={this.onClickClearInput}
                value={this.state.input_value}
            />;

        return (
            <CSSTransition
                in={is_open}
                timeout={100}
                classNames={{
                    enter    : 'contracts-type-dialog--enter',
                    enterDone: 'contracts-type-dialog--enterDone',
                    exit     : 'contracts-type-dialog--exit',
                }}
                unmountOnExit
            >
                <div className='contracts-type-dialog'>
                    <div
                        ref={this.dialog_ref}
                        className='contracts-type-dialog__list-wrapper'
                    >
                        <VerticalTabLayout>
                            <VerticalTabHeaders
                                header_title={localize('Trade types')}
                                items={list}
                                selected={this.state.selected || this.contract_category_label}
                                onChange={this.onChange}
                            />
                            <div className='vertical-tab__content'>
                                <div className='vertical-tab__action-bar'>
                                    {action_bar_items}
                                </div>
                                <div className='vertical-tab__content-container'>
                                    {this.state.is_filtered_list_empty &&
                                        <NoResultsFound text={this.state.input_value} />
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

const ContractTypeDialog = ({
    children,
    is_info_dialog_open,
    is_mobile,
    is_open,
    item,
    list,
    onBackButtonClick,
    onClose,
    onChangeInput,
}) => {
    if (is_mobile) {
        return (
            <React.Fragment>
                <span className='contract-type-widget__select-arrow' />
                <MobileDialog
                    title='Select Trading Type'
                    visible={is_open}
                    onClose={onClose}
                >
                    {children}
                </MobileDialog>
            </React.Fragment>
        );
    }

    return (
        <Dialog
            is_info_dialog_open={is_info_dialog_open}
            is_open={is_open}
            item={item}
            list={list}
            onBackButtonClick={onBackButtonClick}
            onChangeInput={onChangeInput}
        >
            {children}
        </Dialog>
    );
};

ContractTypeDialog.propTypes = {
    children : PropTypes.element,
    is_mobile: PropTypes.bool,
    onClose  : PropTypes.func,
    open     : PropTypes.bool,
};

export default ContractTypeDialog;
