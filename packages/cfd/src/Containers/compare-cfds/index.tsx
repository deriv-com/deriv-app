import { observer } from 'mobx-react';
import React from 'react';
import { Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './compare-cfds.scss';

const compareCFDs = () => {
    return (
        <div className='compare-cfd-header__container'>
            <div className='compare-cfd-header__navigation'>
                <Icon icon='IcArrowLeftBold' />
                <Text size='s' weight='bold' color='prominent'>
                    Traders Hub
                </Text>
            </div>
            <div className='compare-cfd-header__title'>
                <Text size='m' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Compare all available accounts' />
                </Text>
            </div>
        </div>
    );
};

export default observer(compareCFDs);
