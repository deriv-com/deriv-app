import PropTypes from 'prop-types';
import React from 'react';
import ContractTypeMenu from './ContractTypeMenu';
import MobileDialog from '../../Elements/mobile-dialog.jsx';

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
                <MobileDialog title='Select Trading Type' visible={is_open} onClose={onClose}>
                    {children}
                </MobileDialog>
            </React.Fragment>
        );
    }

    return (
        <ContractTypeMenu
            is_info_dialog_open={is_info_dialog_open}
            is_open={is_open}
            item={item}
            list={list}
            onBackButtonClick={onBackButtonClick}
            onChangeInput={onChangeInput}
        >
            {children}
        </ContractTypeMenu>
    );
};

ContractTypeDialog.propTypes = {
    children: PropTypes.element,
    is_mobile: PropTypes.bool,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export default ContractTypeDialog;
