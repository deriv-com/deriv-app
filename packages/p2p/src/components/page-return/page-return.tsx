import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';

type TPageReturnProps = {
    className?: string;
    onClick: () => void;
    page_title: string;
};

const PageReturn = ({ className = '', onClick, page_title }: TPageReturnProps) => {
    return (
        <div className={classNames('page-return', className)} data-testid='dt_page_return'>
            <div onClick={onClick} className='page-return__button'>
                <Icon icon='IcArrowLeftBold' size={16} />
            </div>
            <Text line_height='l' weight='bold'>
                {page_title}
            </Text>
        </div>
    );
};

export default PageReturn;
