import React, { HTMLAttributes, ReactNode } from 'react';
import { Text, Icon } from '@deriv/components';
import classNames from 'classnames';

export interface TAddDerivedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    onClickHandler: () => void;
    class_names?: string;
    title: ReactNode;
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
