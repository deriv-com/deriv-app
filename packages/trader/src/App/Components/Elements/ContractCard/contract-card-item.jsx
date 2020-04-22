import classNames from 'classnames';
import React from 'react';

const ContractCardItem = ({ children, content, header, is_crypto, is_loss, is_won }) => {
    return (
        <div className='contract-card-item'>
            <div className='contract-card-item__header'>{header}</div>
            <div
                className={classNames('contract-card-item__body', {
                    'contract-card-item__body--crypto': is_crypto,
                    'contract-card-item__body--loss': is_loss,
                    'contract-card-item__body--profit': is_won,
                })}
            >
                {content}
                {children}
            </div>
        </div>
    );
};

export default ContractCardItem;
