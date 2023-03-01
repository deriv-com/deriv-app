import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import './arrow-back.scss';

type TArrowBack = {
    className?: string;
    onClickHandler?: VoidFunction;
};

const ArrowBack = ({ className, onClickHandler }: TArrowBack) => {
    return (
        <div className={classNames(className, 'arrow-back')} data-testid={'dt_arrow_back'} onClick={onClickHandler}>
            <Icon icon='IcArrowLeftBold' />
            <Text as='p' size='xs' weight='bold' color='prominent'>
                {localize('Back')}
            </Text>
        </div>
    );
};

export default ArrowBack;
