import React from 'react';
import { useDevice } from '@deriv-com/ui';
import type { TSideNotes } from '../../types';
import styles from './CashierLayout.module.scss';

type TProps = {
    children: React.ReactNode;
    sideNotes: TSideNotes;
};

const CashierLayout: React.FC<TProps> = ({ children, sideNotes }) => {
    const { isMobile } = useDevice();
    const isTopMobileSideNotesVisible = isMobile && sideNotes.position === 'top' && sideNotes.notes.length > 0;
    const isBottomMobileSideNotesVisible = isMobile && sideNotes.position === 'bottom' && sideNotes.notes.length > 0;

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {isTopMobileSideNotesVisible && <div>{sideNotes.notes}</div>}
                {children}
                {isBottomMobileSideNotesVisible && <div>{sideNotes.notes}</div>}
            </div>
            {!isMobile && <div className={styles['sidebar--right']}>{sideNotes.notes}</div>}
        </div>
    );
};

export default CashierLayout;
