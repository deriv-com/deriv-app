import React, { HTMLAttributes } from 'react';
import { Text, Icon } from '@deriv/components';
import classNames from 'classnames';

export interface TAddDerivedProps extends HTMLAttributes<HTMLDivElement> {
    onClickHandler: () => void;
    class_names?: string;
    title: string;
}

const AddDerived = ({ title, onClickHandler, class_names }: TAddDerivedProps) => {
    return (
        <div className={classNames('add-derived', class_names)} onClick={onClickHandler}>
            <Icon icon='icAppstoreAddRounded' width='24' height='24' />
            <Text size='xs'>{title}</Text>
        </div>
    );
};

export default AddDerived;
