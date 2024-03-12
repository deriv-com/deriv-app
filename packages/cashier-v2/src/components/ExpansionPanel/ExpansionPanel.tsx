import React, { useState } from 'react';
import clsx from 'clsx';
import ChevronIcon from '../../assets/images/chevron-icon.svg';
import styles from './ExpansionPanel.module.scss';

type TProps = {
    content: React.ReactNode;
    header: React.ReactNode;
};

const ExpansionPanel: React.FC<TProps> = ({ content, header }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onClick = () => setIsOpen(!isOpen);

    return (
        <div className={styles.container}>
            <div>
                {header}
                {isOpen && content}
            </div>
            <div className={styles['icon-wrapper']}>
                <ChevronIcon
                    className={clsx(styles['chevron-icon'], {
                        [styles['chevron-icon--active']]: isOpen,
                    })}
                    onClick={onClick}
                />
            </div>
        </div>
    );
};

export default ExpansionPanel;
