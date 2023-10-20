import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../Base';

type TPercentageSelectorBlock = {
    isHighlighted?: boolean;
    label: string;
    onClick: VoidFunction;
};

const PercentageSelectorBlock = ({ isHighlighted, label, onClick }: TPercentageSelectorBlock) => {
    return (
        <div className='percentage-selector-block-container'>
            <WalletText className='percentage-selector__text' color='prominent' size='xs'>
                {label}
            </WalletText>
            <div
                className={classNames('percentage-selector-block', {
                    'percentage-selector-block--highlighted': isHighlighted,
                })}
                onClick={onClick}
            />
        </div>
    );
};

export default PercentageSelectorBlock;
