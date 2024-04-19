import React from 'react';
import { Score } from '../../../utils/password-validation';

export interface PasswordMeterProps {
    score: Score;
}

const PasswordMeter: React.FC<PasswordMeterProps> = ({ score }) => {
    const strengthColors = {
        0: 'wallets-password__meter--initial',
        1: 'wallets-password__meter--weak',
        2: 'wallets-password__meter--moderate',
        3: 'wallets-password__meter--strong',
        4: 'wallets-password__meter--complete',
    };

    return (
        <div className='wallets-password__meter'>
            <div className={strengthColors[score ?? 0]} />
        </div>
    );
};

export default PasswordMeter;
