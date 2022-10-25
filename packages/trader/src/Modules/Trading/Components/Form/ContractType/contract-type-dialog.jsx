import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { Header } from './ContractTypeInfo';
import { localize } from '@deriv/translations';
import ContractTypeMenu from './ContractTypeMenu';

const ContractTypeDialog = ({
    children,
    is_info_dialog_open,
    onClose,
    is_open,
    item,
    list,
    selected,
    categories,
    onBackButtonClick,
    onChangeInput,
    onCategoryClick,
    show_loading,
}) => {
    const current_mobile_title = is_info_dialog_open ? (
        <Header title={item.text} onClickGoBack={onBackButtonClick} text_size='xs' />
    ) : (
        localize('Trade type')
    );
    return (
        <React.Fragment>
            <MobileWrapper>
                <span className='contract-type-widget__select-arrow' />
                <MobileDialog
                    portal_element_id='modal_root'
                    title={current_mobile_title}
                    header_classname='contract-type-widget__header'
                    wrapper_classname='contracts-modal-list'
                    visible={is_open}
                    onClose={onClose}
                    has_content_scroll
                >
                    {children}
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <ContractTypeMenu
                    is_info_dialog_open={is_info_dialog_open}
                    is_open={is_open}
                    item={item}
                    list={list}
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

ContractTypeDialog.propTypes = {
    categories: PropTypes.array,
    children: PropTypes.element,
    is_info_dialog_open: PropTypes.bool,
    is_open: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onBackButtonClick: PropTypes.func,
    onCategoryClick: PropTypes.func,
    onChangeInput: PropTypes.func,
    onClose: PropTypes.func,
    selected: PropTypes.string,
    show_loading: PropTypes.bool,
};

export default ContractTypeDialog;
