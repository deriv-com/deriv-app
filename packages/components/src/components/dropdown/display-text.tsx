import React from 'react';
import classNames from 'classnames';
import { getDisplayText, TList } from './utility';
import Text from '../text';

type TDisplayText = {
    className: string;
    has_symbol?: boolean;
    list: TList;
    name?: string;
    placeholder?: string;
    value: string | number;
    is_align_text_left?: boolean;
};

const DisplayText = ({ className, has_symbol, list, is_align_text_left, placeholder, name, value }: TDisplayText) => {
    const symbol_value_class = value && has_symbol ? `symbols--${value.toString().toLowerCase()}` : null;
    return (
        <React.Fragment>
            {has_symbol ? (
                <span className={classNames('symbols dc-dropdown__display-symbol', symbol_value_class, className)} />
            ) : (
                <Text
                    size='xs'
                    color='prominent'
                    align='center'
                    className={classNames('dc-dropdown__display-text', className)}
                    name={name}
                    value={value}
                >
                    {getDisplayText(list, value)}
                </Text>
            )}
            {placeholder && (
                <div
                    className={classNames('dc-dropdown__display-placeholder', {
                        'dc-dropdown__display-placeholder--is-title': value,
                        'dc-dropdown__display-placeholder--is-left-text': is_align_text_left,
                    })}
                >
                    <Text
                        size='xs'
                        color='grey'
                        line_height='unset'
                        className={classNames('dc-dropdown__display-placeholder-text', {
                            'dc-dropdown__display-placeholder-text-limit-fit': !value && placeholder.length > 45,
                        })}
                    >
                        {placeholder}
                    </Text>
                </div>
            )}
        </React.Fragment>
    );
};

export default DisplayText;
