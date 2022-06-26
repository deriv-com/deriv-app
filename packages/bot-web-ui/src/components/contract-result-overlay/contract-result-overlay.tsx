import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TContractResultOverlayProps = {
    profit: number;
    className: string;
};

const ContractResultOverlay = ({ profit, className }: TContractResultOverlayProps) => {
    const has_won_contract = profit >= 0;

    return (
        <div
            className={classNames('db-contract-card__result', className, {
                'db-contract-card__result--won': has_won_contract,
                'db-contract-card__result--lost': !has_won_contract,
            })}
        >
            <Text weight='bold' className='db-contract-card__result-caption'>
                {has_won_contract ? (
                    <React.Fragment>
                        {localize('Won')}
                        <Icon icon='IcCheckmarkCircle' className='db-contract-card__result-icon' color='green' />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {localize('Lost')}
                        <Icon icon='IcCrossCircle' className='db-contract-card__result-icon' color='red' />
                    </React.Fragment>
                )}
            </Text>
        </div>
    );
};

export default ContractResultOverlay;
