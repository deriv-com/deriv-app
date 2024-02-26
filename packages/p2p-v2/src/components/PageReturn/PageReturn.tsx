import React from 'react';
import clsx from 'clsx';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './PageReturn.scss';

type TPageReturnProps = {
    className?: string;
    onClick: () => void;
    pageTitle: string;
};

const PageReturn = ({ className = '', onClick, pageTitle }: TPageReturnProps) => {
    return (
        <div className={clsx('p2p-v2-page-return', className)}>
            <LabelPairedArrowLeftLgBoldIcon
                className='p2p-v2-page-return__button'
                data-testid='dt_p2p_v2_page_return_btn'
                onClick={onClick}
            />
            <Text>{pageTitle}</Text>
        </div>
    );
};

export default PageReturn;
