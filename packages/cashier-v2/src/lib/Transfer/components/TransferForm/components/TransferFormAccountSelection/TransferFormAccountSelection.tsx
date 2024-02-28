import React from 'react';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import { TransferAccountTile } from './components/TransferAccountTile';
import styles from './TransferFormAccountSelection.module.scss';

const TransferFormAccountSelection = () => {
    return (
        <div className={styles.container}>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={[
                    {
                        text: <TransferAccountTile />,
                        value: 'opt1',
                    },
                ]}
                name='transferFromDropdown'
                value='opt1'
            />
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
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
