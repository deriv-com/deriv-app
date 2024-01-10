import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import ContractCardDialog from './contract-card-dialog';
import ContractUpdateForm, { TGeneralContractCardBodyProps } from './contract-update-form';
import PopoverMessageCheckbox from '../../popover-message-checkbox';
import Icon from '../../icon';
import DesktopWrapper from '../../desktop-wrapper';
import MobileDialog from '../../mobile-dialog';
import MobileWrapper from '../../mobile-wrapper';
import Popover from '../../popover';
import Div100vhContainer from '../../div100vh-container';
import './sass/contract-card-dialog.scss';

let ContractUpdateFormWrapper: React.ElementType;

export type TToggleCardDialogProps = Pick<
    TGeneralContractCardBodyProps,
    | 'addToast'
    | 'connectWithContractUpdate'
    | 'current_focus'
    | 'error_message_alignment'
    | 'getCardLabels'
    | 'getContractById'
    | 'onMouseLeave'
    | 'removeToast'
    | 'setCurrentFocus'
> & {
    contract_id?: number;
    is_valid_to_cancel?: boolean;
    should_show_cancellation_warning?: boolean;
    toggleCancellationWarning?: () => void;
    is_accumulator?: boolean;
    is_turbos?: boolean;
};

const ToggleCardDialog = ({
    addToast,
    connectWithContractUpdate,
    contract_id,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    is_accumulator,
    is_turbos,
    is_valid_to_cancel,
    onMouseLeave,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    toggleCancellationWarning,
}: TToggleCardDialogProps) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [should_hide_selected, setShouldHideSelected] = React.useState(!should_show_cancellation_warning);

    const toggle_ref = React.useRef<HTMLDivElement>(null);
    const dialog_ref = React.useRef<HTMLDivElement>(null);
    const contract = getContractById(Number(contract_id));

    React.useEffect(() => {
        ContractUpdateFormWrapper = connectWithContractUpdate?.(ContractUpdateForm) || ContractUpdateForm;
    }, [connectWithContractUpdate]);

    React.useEffect(() => {
        if (is_visible && toggle_ref?.current && dialog_ref?.current) {
            const icon_bound = toggle_ref.current.getBoundingClientRect();
            const target_bound = dialog_ref.current.getBoundingClientRect();
            const body_bound = document.body.getBoundingClientRect();

            let { top: icon_bound_top } = icon_bound;
            const { right } = icon_bound;

            if (icon_bound_top + target_bound?.height > body_bound.height) {
                icon_bound_top -= target_bound?.height - icon_bound.height;
            }

            if (right + target_bound?.width > body_bound.width) {
                setLeft(right - target_bound?.width - 16);
            } else {
                setLeft(right - 16);
            }
            setTop(icon_bound_top);
        }
    }, [is_visible]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const onPopoverClose = () => {
        if (should_hide_selected) {
            toggleCancellationWarning?.();
        }
    };

    const onPopoverCheckboxChange = () => {
        setShouldHideSelected(!should_hide_selected);
    };

    const toggleDialog = (e: React.MouseEvent<HTMLDivElement>) => {
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
    };

    const toggleDialogWrapper = React.useCallback(toggleDialog, [toggleDialog]);

    const edit_icon = (
        <Icon
            className='dc-contract-card-dialog-toggle__icon'
            icon='IcEdit'
            color={is_valid_to_cancel ? 'disabled' : ''}
            size={12}
        />
    );

    const toggle_wrapper =
        should_show_cancellation_warning && isDesktop() ? (
            <Popover
                alignment='right'
                classNameBubble='dc-contract-card-dialog__popover'
                is_bubble_hover_enabled
                margin={2}
                zIndex='2'
                message={
                    <PopoverMessageCheckbox
                        defaultChecked={should_hide_selected}
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
            <div ref={toggle_ref} className='dc-contract-card-dialog-toggle' onClick={toggleDialogWrapper}>
                {is_valid_to_cancel ? toggle_wrapper : edit_icon}
            </div>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={is_visible}
                    onClose={toggleDialogWrapper}
                    wrapper_classname='contract-update'
                >
                    {ContractUpdateFormWrapper && (
                        <Div100vhContainer className='contract-update__wrapper' height_offset='40px'>
                            <ContractUpdateFormWrapper
                                addToast={addToast}
                                contract={contract}
                                current_focus={current_focus}
                                error_message_alignment={error_message_alignment}
                                getCardLabels={getCardLabels}
                                getContractById={getContractById}
                                is_accumulator={is_accumulator}
                                is_turbos={is_turbos}
                                onMouseLeave={onMouseLeave}
                                removeToast={removeToast}
                                setCurrentFocus={setCurrentFocus}
                                toggleDialog={toggleDialogWrapper}
                            />
                        </Div100vhContainer>
                    )}
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <ContractCardDialog
                    ref={dialog_ref}
                    is_visible={is_visible}
                    left={left}
                    top={top}
                    toggle_ref={toggle_ref}
                    toggleDialog={toggleDialogWrapper}
                >
                    {ContractUpdateFormWrapper && (
                        <ContractUpdateFormWrapper
                            addToast={addToast}
                            contract={contract}
                            current_focus={current_focus}
                            error_message_alignment={error_message_alignment}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            is_accumulator={is_accumulator}
                            is_turbos={is_turbos}
                            onMouseLeave={onMouseLeave}
                            removeToast={removeToast}
                            setCurrentFocus={setCurrentFocus}
                            toggleDialog={toggleDialogWrapper}
                        />
                    )}
                </ContractCardDialog>
            </DesktopWrapper>
        </div>
    );
};

ToggleCardDialog.displayName = 'ToggleCardDialog';

export default React.memo(ToggleCardDialog);
