import React from 'react';
import { useDevice } from '@deriv-com/ui';
import styles from './PageContainer.module.scss';

type TSidebar = {
    content: JSX.Element;
    contentPosition?: 'bottom' | 'top';
};

type TProps = {
    children: React.ReactNode;
    rightSidebar?: TSidebar;
};

const PageContainer: React.FC<TProps> = ({ children, rightSidebar }) => {
    const { isMobile } = useDevice();
    const isTopMobileContentVisible = isMobile && rightSidebar?.contentPosition === 'top' && rightSidebar.content;
    const isBottomMobileContentVisible = isMobile && rightSidebar?.contentPosition === 'bottom' && rightSidebar.content;

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {isTopMobileContentVisible && <div>{rightSidebar.content}</div>}
                {children}
                {isBottomMobileContentVisible && <div>{rightSidebar.content}</div>}
            </div>
            {!isMobile && <div className={styles['sidebar--right']}>{rightSidebar?.content}</div>}
        </div>
    );
};

export default PageContainer;
