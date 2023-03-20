import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { region_availability } from 'Constants/platform-config';
import { localize } from '@deriv/translations';
import './regulators-switcher.scss';

type SwitcherItemProps = {
    onClick: () => void;
    is_selected: boolean;
};

const SwitcherItem = ({ children, is_selected, ...props }: SwitcherItemProps & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={classNames('item', { 'is-selected': is_selected })} {...props}>
            <Text size='xs' weight={is_selected ? 'bold' : 'normal'}>
                {children}
            </Text>
        </div>
    );
};

const RegulatorSwitcher = observer(() => {
    const { traders_hub } = useStore();
    const { toggleRegulatorsCompareModal, selected_region, selectRegion } = traders_hub;

    return (
        <div className='regulators-switcher__container'>
            <div className='regulators-switcher--text'>
                <Text>{localize('Regulation:')}</Text>
                <div className='regulators-switcher--icon' onClick={() => toggleRegulatorsCompareModal()}>
                    <Icon icon='IcInfoOutline' />
                </div>
            </div>
            <div className='regulators-switcher__switch'>
                {region_availability.map(region => {
                    return (
                        <SwitcherItem
                            key={`regulator-item_${region}`}
                            is_selected={region === selected_region}
                            onClick={() => selectRegion(region)}
                        >
                            {region}
                        </SwitcherItem>
                    );
                })}
            </div>
        </div>
    );
});

export default RegulatorSwitcher;
