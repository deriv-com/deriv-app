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

const ToggleCardDialog = ({
    addToast,
    contract_id,
    connectWithContractUpdate,
    current_focus,
    getCardLabels,
    getContractById,
    is_valid_to_cancel,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [is_do_not_show_selected, setIsDoNotShowSelected] = React.useState(!should_show_cancellation_warning);

    const toggle_ref = React.useRef();
    const dialog_ref = React.useRef();
    const contract = getContractById(contract_id);
    const ContractUpdateFormWrapper = connectWithContractUpdate?.(ContractUpdateForm) || ContractUpdateForm;

    React.useEffect(() => {
        if (is_visible && toggle_ref && toggle_ref.current && dialog_ref && dialog_ref.current) {
            const icon_bound = toggle_ref.current.getBoundingClientRect();
            const portal_ref = dialog_ref.current;
            const target_bound = portal_ref?.current?.getBoundingClientRect();
            const body_bound = document.body.getBoundingClientRect();

            let { top: icon_bound_top } = icon_bound;
            const { right } = icon_bound;

            if (icon_bound_top + target_bound?.height > body_bound.height) {
                icon_bound_top -= target_bound?.height - icon_bound.height;
            }

            setTop(icon_bound_top);
            setLeft(right - 16);
        }
    }, [is_visible]);

    const handleClick = e => {
        e.stopPropagation();
    };

    const onPopoverClose = () => {
        if (is_do_not_show_selected) {
            toggleCancellationWarning();
        }
    };

    const onPopoverCheckboxChange = () => {
        setIsDoNotShowSelected(!is_do_not_show_selected);
    };

    const toggleDialog = React.useCallback(
        e => {
            e.preventDefault();
            e.stopPropagation();
            if (isMobile() && should_show_cancellation_warning && is_valid_to_cancel) {
                addToast({
                    key: 'deal_cancellation_active',
                    content: getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE,
                    type: 'error',
                });
            }

            if (is_valid_to_cancel) return;

            setIsVisible(!is_visible);
        },
        [is_visible]
    );

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
                        defaultChecked={is_do_not_show_selected}
                        checkboxLabel={getCardLabels().DONT_SHOW_THIS_AGAIN}
                        message={getCardLabels().TAKE_PROFIT_LOSS_NOT_AVAILABLE}
                        name='should_show_cancellation_warning'
                        onChange={onPopoverCheckboxChange}
                    />
                }
                onBubbleClose={onPopoverClose}
            >
                <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
            </Popover>
        ) : (
            <div className='dc-contract-card-dialog-toggle__wrapper'>{edit_icon}</div>
        );

    return (
        <div onClick={handleClick}>
            <div ref={toggle_ref} className='dc-contract-card-dialog-toggle' onClick={toggleDialog}>
                {is_valid_to_cancel ? toggle_wrapper : edit_icon}
            </div>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={is_visible}
                    onClose={toggleDialog}
                    wrapper_classname='contract-update'
                >
                    <Div100vhContainer className='contract-update__wrapper' height_offset='40px'>
                        <ContractUpdateFormWrapper
                            addToast={addToast}
                            current_focus={current_focus}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            removeToast={removeToast}
                            contract={contract}
                            setCurrentFocus={setCurrentFocus}
                            status={status}
                            toggleDialog={toggleDialog}
                        />
                    </Div100vhContainer>
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <ContractCardDialog
                    ref={dialog_ref}
                    is_visible={is_visible}
                    left={left}
                    top={top}
                    toggle_ref={toggle_ref}
                    toggleDialog={toggleDialog}
                >
                    <ContractUpdateFormWrapper
                        addToast={addToast}
                        current_focus={current_focus}
                        getCardLabels={getCardLabels}
                        getContractById={getContractById}
                        removeToast={removeToast}
                        contract={contract}
                        setCurrentFocus={setCurrentFocus}
                        toggleDialog={toggleDialog}
                    />
                </ContractCardDialog>
            </DesktopWrapper>
        </div>
    );
};

ToggleCardDialog.displayName = 'ToggleCardDialog';

ToggleCardDialog.propTypes = {
    addToast: PropTypes.func,
    contract_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    current_focus: PropTypes.string,
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

export default React.memo(ToggleCardDialog);
