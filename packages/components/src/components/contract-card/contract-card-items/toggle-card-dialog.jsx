import React from 'react';
import PropTypes from 'prop-types';
import { isDesktop, isMobile } from '@deriv/shared';
import ContractCardDialog from './contract-card-dialog.jsx';
import ContractUpdateForm from './contract-update-form.jsx';
import PopoverMessageCheckbox from '../../popover-message-checkbox';
import Icon from '../../icon';
import DesktopWrapper from '../../desktop-wrapper';
import MobileDialog from '../../mobile-dialog';
import MobileWrapper from '../../mobile-wrapper';
import Popover from '../../popover';
import Div100vhContainer from '../../div100vh-container';
import './sass/contract-card-dialog.scss';

class ToggleCardDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
            top: 0,
            left: 0,
            is_do_not_show_selected: !this.props.should_show_cancellation_warning,
        };
        this.toggle_ref = React.createRef();
        this.dialog_ref = React.createRef();
        this.contract = props.getContractById(props.contract_id);
        this.ContractUpdateFormWrapper = props.connectWithContractUpdate?.(ContractUpdateForm) || ContractUpdateForm;
    }

    onPopoverClose = () => {
        if (this.state.is_do_not_show_selected) {
            this.props.toggleCancellationWarning();
        }
    };

    onPopoverCheckboxChange = () => {
        this.setState(prev_state => {
            return {
                is_do_not_show_selected: !prev_state.is_do_not_show_selected,
            };
        });
    };

    toggleDialog = e => {
        e.preventDefault();
        e.stopPropagation();
        const { addToast, getCardLabels, should_show_cancellation_warning, is_valid_to_cancel } = this.props;
        if (isMobile() && should_show_cancellation_warning && is_valid_to_cancel) {
            addToast({
                key: 'deal_cancellation_active',
                content: getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE,
                type: 'error',
            });
        }

        if (is_valid_to_cancel) return;

        this.setState(
            state => ({ is_visible: !state.is_visible }),
            () => {
                if (
                    this.state.is_visible &&
                    this.toggle_ref &&
                    this.toggle_ref.current &&
                    this.dialog_ref &&
                    this.dialog_ref.current
                ) {
                    const icon_bound = this.toggle_ref.current.getBoundingClientRect();
                    const { ref: portalRef } = this.dialog_ref.current;
                    const target_bound = portalRef.current.getBoundingClientRect();
                    const body_bound = document.body.getBoundingClientRect();

                    let { top } = icon_bound;
                    const { right } = icon_bound;

                    if (icon_bound.top + target_bound.height > body_bound.height) {
                        top -= target_bound.height - icon_bound.height;
                    }

                    this.setState({
                        top,
                        left: right - 16,
                    });
                }
            }
        );
    };

    render() {
        const {
            addToast,
            getCardLabels,
            getContractById,
            is_valid_to_cancel,
            removeToast,
            setCurrentFocus,
            should_show_cancellation_warning,
            status,
        } = this.props;

        const edit_icon = (
            <Icon
                className='dc-contract-card-dialog-toggle__icon'
                icon='IcEdit'
                color={is_valid_to_cancel && 'disabled'}
                size={12}
            />
        );

        const toggle_wrapper =
            should_show_cancellation_warning && isDesktop() ? (
                <Popover
                    alignment='right'
                    classNameBubble='trade-container__popover'
                    is_bubble_hover_enabled
                    margin={2}
                    zIndex={2}
                    message={
                        <PopoverMessageCheckbox
                            defaultChecked={this.state.is_do_not_show_selected}
                            checkboxLabel={getCardLabels().DONT_SHOW_THIS_AGAIN}
                            message={getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE}
                            name='should_show_cancellation_warning'
                            onChange={this.onPopoverCheckboxChange}
                        />
                    }
                    onBubbleClose={this.onPopoverClose}
                >
                    <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
                </Popover>
            ) : (
                <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
            );

        const ContractUpdateFormWrapper = this.ContractUpdateFormWrapper;

        return (
            <React.Fragment>
                <div ref={this.toggle_ref} className='dc-contract-card-dialog-toggle' onClick={this.toggleDialog}>
                    {is_valid_to_cancel ? toggle_wrapper : edit_icon}
                </div>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='modal_root'
                        visible={this.state.is_visible}
                        onClose={this.toggleDialog}
                        wrapper_classname='contract-update'
                    >
                        <Div100vhContainer className='contract-update__wrapper' height_offset='40px'>
                            <ContractUpdateFormWrapper
                                addToast={addToast}
                                getCardLabels={getCardLabels}
                                getContractById={getContractById}
                                removeToast={removeToast}
                                contract={this.contract}
                                setCurrentFocus={setCurrentFocus}
                                status={status}
                                toggleDialog={this.toggleDialog}
                            />
                        </Div100vhContainer>
                    </MobileDialog>
                </MobileWrapper>
                <DesktopWrapper>
                    <ContractCardDialog
                        ref={this.dialog_ref}
                        is_visible={this.state.is_visible}
                        left={this.state.left}
                        top={this.state.top}
                        toggle_ref={this.toggle_ref}
                        toggleDialog={this.toggleDialog}
                    >
                        <ContractUpdateFormWrapper
                            addToast={addToast}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            removeToast={removeToast}
                            contract={this.contract}
                            setCurrentFocus={setCurrentFocus}
                            status={status}
                            toggleDialog={this.toggleDialog}
                        />
                    </ContractCardDialog>
                </DesktopWrapper>
            </React.Fragment>
        );
    }
}

ToggleCardDialog.propTypes = {
    addToast: PropTypes.func,
    contract_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_valid_to_cancel: PropTypes.bool,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
    connectWithContractUpdate: PropTypes.func,
};

export default ToggleCardDialog;
