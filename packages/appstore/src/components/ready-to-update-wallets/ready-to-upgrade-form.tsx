import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import WalletsImage from 'Assets/svgs/wallets';
import UpgradeInformationList from './upgrade-info-list';

export type TReadyToUpgradeForm = {
    is_eu: boolean;
};

const ReadyToUpgradeForm = ({ is_eu }: TReadyToUpgradeForm) => (
    <React.Fragment>
        <WalletsImage image={'ReadyToUpdateWalletsIcon'} className='wallet-wrapper--icon' />
        <div className='wallet-wrapper--text'>
            <Text size={isMobile() ? 'xsm' : 'm'} align='center' weight='bold' line_height={isMobile() ? 'm' : 'l'}>
                <Localize i18n_default_text='Ready to upgrade?' />
            </Text>
            <Text size={isMobile() ? 'xs' : 's'} align='center' line_height={isMobile() ? 'm' : 'l'}>
                <Localize
                    i18n_default_text="This is <0>irreversible.</0> Once you upgrade, the Cashier won't be available anymore. You'll need to
                use Wallets to deposit, withdraw, and transfer funds."
                    components={
                        <Text
                            size={isMobile() ? 'xs' : 's'}
                            weight='bold'
                            align='center'
                            line_height={isMobile() ? 'm' : 'l'}
                            key={0}
                        />
                    }
                />
            </Text>
        </div>
        <div className='wallet-wrapper--info-section'>
            <UpgradeInformationList is_eu={is_eu} />
        </div>
    </React.Fragment>
);

export default ReadyToUpgradeForm;
