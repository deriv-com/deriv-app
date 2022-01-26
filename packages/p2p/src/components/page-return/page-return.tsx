import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import './page-return.scss';

type PageReturnProps = {
    onClick: () => void,
    page_title: string
};

const PageReturn = (
    {
        className,
        onClick,
        page_title
    }: PageReturnProps
) => {
    return (
        <div className={classNames('page-return', className)}>
            <div onClick={onClick} className='page-return__button'>
                <Icon icon='IcArrowLeftBold' size={16} />
            </div>
            <Text size='s' color='general' line_height='m' weight='bold'>
                {page_title}
            </Text>
        </div>
    );
};

export default PageReturn;
