import React from 'react';

export interface PasswordMeterProps {
    strength?: number;
}

const PasswordMeter: React.FC<PasswordMeterProps> = ({ strength }) => {
    const strengthColors: { [key: number]: string } = {
        0: 'wallets-password__meter--initial',
        1: 'wallets-password__meter--weak',
        2: 'wallets-password__meter--moderate',
        3: 'wallets-password__meter--strong',
        4: 'wallets-password__meter--complete',
    };
    return (
        <div className='wallets-password__meter'>
            <div className={strengthColors[strength ?? 0]} />
        </div>
    );
};

export default PasswordMeter;
