import React, { HTMLAttributes } from 'react';
import { Text } from '@deriv/ui';
import classNames from 'classnames';
import { Icon } from '@deriv/components';

export interface TAddDerivedProps extends HTMLAttributes<HTMLDivElement> {
    onClickHandler: () => void;
    class_names?: string;
    title: string;
}

const AddDerived = ({ title, onClickHandler, class_names }: TAddDerivedProps) => {
    return (
        <div className={classNames('add-derived', class_names)} onClick={onClickHandler}>
            <Icon icon='icAppstoreAddRounded' width='24' height='24' />
            <Text type='paragraph-2' bold color='prominant'>
                {title}
            </Text>
        </div>
    );
};

export default AddDerived;
