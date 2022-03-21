import classNames from 'classnames';
import React from 'react';

const ContractCardItem = ({ className, children, content, header, is_crypto, is_loss, is_won }) => {
    return (
        <div className={classNames('dc-contract-card-item', className)}>
            <div className='dc-contract-card-item__header'>{header}</div>
            <div
                className={classNames('dc-contract-card-item__body', {
                    'dc-contract-card-item__body--crypto': is_crypto,
                    'dc-contract-card-item__body--loss': is_loss,
                    'dc-contract-card-item__body--profit': is_won,
                })}
            >
                {content}
                {children}
            </div>
        </div>
    );
};

export default ContractCardItem;
