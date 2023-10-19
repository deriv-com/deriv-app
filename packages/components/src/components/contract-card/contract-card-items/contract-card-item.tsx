import classNames from 'classnames';
import React from 'react';

export type TContractCardItemProps = {
    className: string;
    header: string;
    is_crypto: boolean;
    is_loss: boolean;
    is_won: boolean;
    is_multiplier?: boolean;
};

const ContractCardItem = ({
    className,
    children,
    header,
    is_crypto,
    is_loss,
    is_won,
    is_multiplier,
}: React.PropsWithChildren<Partial<TContractCardItemProps>>) => {
    return (
        <div className={classNames('dc-contract-card-item', className)}>
            <div
                className={classNames('dc-contract-card-item__header', {
                    'dc-contract-card-item__header--multiplier': is_multiplier,
                })}
            >
                {header}
            </div>
            <div
                className={classNames('dc-contract-card-item__body', {
                    'dc-contract-card-item__body--crypto': is_crypto,
                    'dc-contract-card-item__body--loss': is_loss,
                    'dc-contract-card-item__body--profit': is_won,
                })}
            >
                {children}
            </div>
        </div>
    );
};

export default ContractCardItem;
