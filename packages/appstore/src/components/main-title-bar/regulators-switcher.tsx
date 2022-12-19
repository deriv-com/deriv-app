import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import './regulators-switcher.scss';
import { useStores } from 'Stores/index';
import { region_availability } from 'Constants/platform-config';
import { observer } from 'mobx-react-lite';

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

const RegulatorSwitcher = () => {
    const { traders_hub } = useStores();
    const { toggleRegulatorsCompareModal } = traders_hub;

    return (
        <div className='regulators-switcher'>
            <div className='regulators-switcher--text'>
                <Text>Regulators:</Text>
                <div className='regulators-switcher--icon' onClick={() => toggleRegulatorsCompareModal()}>
                    <Icon icon='IcInfoOutline' />
                </div>
            </div>
            <div className='regulators-switcher__switch'>
                {region_availability.map(region => {
                    return (
                        <SwitcherItem
                            key={`regulator-item_${region}`}
                            is_selected={region === traders_hub.selected_region}
                            onClick={() => traders_hub.selectRegion(region)}
                        >
                            {region}
                        </SwitcherItem>
                    );
                })}
            </div>
        </div>
    );
};

export default observer(RegulatorSwitcher);
