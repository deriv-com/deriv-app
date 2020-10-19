import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
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
}) => (
    <React.Fragment>
        <MobileWrapper>
            <span className='contract-type-widget__select-arrow' />
            <MobileDialog
                portal_element_id='modal_root'
                title={localize('Trade type')}
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
            >
                {children}
            </ContractTypeMenu>
        </DesktopWrapper>
    </React.Fragment>
);

ContractTypeDialog.propTypes = {
    children: PropTypes.element,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export default ContractTypeDialog;
