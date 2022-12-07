import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import './regulators-switcher.scss';

const RegulatorSwitcher = () => {
    return (
        <div className='regulators-switcher'>
            <Text>Regulators:</Text>
            <div className='regulators-switcher__switch'>
                <div className={classNames('item', { 'is-selected': true })}>
                    <Text size='xs' weight={true ? 'bold' : 'normal'}>
                        Non-EU
                    </Text>
                </div>
                <div className={classNames('item')}>
                    <Text size='xs'>EU</Text>
                </div>
            </div>
        </div>
    );
};

export default RegulatorSwitcher;
