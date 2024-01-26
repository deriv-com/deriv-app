import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import ArrowLeftIcon from '../../public/ic-arrow-left.svg';
import './PageReturn.scss';

type TPageReturnProps = {
    className?: string;
    onClick: () => void;
    pageTitle: string;
};

const PageReturn = ({ className = '', onClick, pageTitle }: TPageReturnProps) => {
    return (
        <div className={clsx('p2p-v2-page-return', className)}>
            <ArrowLeftIcon className='p2p-v2-page-return__button' onClick={onClick} />
            <Text>{pageTitle}</Text>
        </div>
    );
};

export default PageReturn;
