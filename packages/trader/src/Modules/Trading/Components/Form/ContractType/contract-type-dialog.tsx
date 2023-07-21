import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { Header } from './ContractTypeInfo';
import { localize } from '@deriv/translations';
import ContractTypeMenu from './ContractTypeMenu';

type TContractTypeDialog = {
    is_info_dialog_open: boolean;
    onClose: React.ComponentProps<typeof MobileDialog>['onClose'];
    is_open: boolean;
};

type TContractTypeDialogProps = Pick<
    React.ComponentProps<typeof ContractTypeMenu>,
    'selected' | 'categories' | 'onBackButtonClick' | 'onChangeInput' | 'onCategoryClick' | 'show_loading' | 'item'
> &
    TContractTypeDialog;

const ContractTypeDialog = ({
    children,
    is_info_dialog_open,
    onClose,
    is_open,
    item,
    selected,
    categories,
    onBackButtonClick,
    onChangeInput,
    onCategoryClick,
    show_loading,
}: React.PropsWithChildren<TContractTypeDialogProps>) => {
    const current_mobile_title = is_info_dialog_open ? (
        <Header title={item?.text || ''} onClickGoBack={onBackButtonClick} text_size='xs' />
    ) : (
        localize('Trade types')
    );
    return (
        <React.Fragment>
            <MobileWrapper>
                <span className='contract-type-widget__select-arrow' />
                <MobileDialog
                    portal_element_id='modal_root'
                    title={current_mobile_title}
                    header_classname='contract-type-widget__header'
                    wrapper_classname={is_info_dialog_open ? 'contracts-modal-info' : 'contracts-modal-list'}
                    visible={is_open}
                    onClose={onClose}
                    has_content_scroll={!is_info_dialog_open}
                >
                    {children}
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <ContractTypeMenu
                    is_info_dialog_open={is_info_dialog_open}
                    is_open={is_open}
                    item={item}
                    selected={selected}
                    categories={categories}
                    onBackButtonClick={onBackButtonClick}
                    onChangeInput={onChangeInput}
                    onCategoryClick={onCategoryClick}
                    show_loading={show_loading}
                >
                    {children}
                </ContractTypeMenu>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default ContractTypeDialog;
