import React from 'react';
import { Dropdown } from '@deriv-com/ui';
import styles from './TransferFormAccountSelection.module.scss';

const TransferFormAccountSelection = () => {
    return (
        <div className={styles.container}>
            <Dropdown
                dropdownIcon=''
                list={[
                    {
                        text: <div>yalla</div>,
                        value: 'yalla',
                    },
                ]}
                name='transferFromDropdown'
            />
            <Dropdown
                dropdownIcon=''
                list={[
                    {
                        text: <div>yalla</div>,
                        value: 'yalla',
                    },
                ]}
                name='transferToDropdown'
            />
        </div>
    );
};

export default TransferFormAccountSelection;
