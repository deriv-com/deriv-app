import React from 'react';
import { TWalletsMigrationStatus } from 'Types';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerReady from './wallets-banner-ready';

// just for testing purpose and will be deleted in the future
type TBannerSwitcher = {
    status: TWalletsMigrationStatus;
    onChangeStatus: (value: TWalletsMigrationStatus) => void;
    is_eu: boolean;
    onChangeEU: (value: boolean) => void;
    children?: React.ReactNode;
};

// just for testing
const BannerSwitcher = ({ status, is_eu, onChangeStatus, onChangeEU, children }: TBannerSwitcher) => {
    const onStatusChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeStatus(event.target.value as TWalletsMigrationStatus);
    };

    const onEUChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'EU') onChangeEU(true);
        else if (event.target.value === 'Non-EU') onChangeEU(false);
    };

    return (
        <React.Fragment>
            <div>
                <select name='status' onChange={onStatusChangeHandler} value={status}>
                    <option value='ineligible'>ineligible</option>
                    <option value='eligible'>eligible</option>
                    <option value='in_progress'>in_progress</option>
                    <option value='migrated'>migrated</option>
                    <option value='failed'>failed</option>
                </select>
                <select name='is_eu' onChange={onEUChangeHandler} value={is_eu ? 'EU' : 'Non-EU'}>
                    <option value='EU'>EU</option>
                    <option value='Non-EU'>Non-EU</option>
                </select>
            </div>
            {children}
        </React.Fragment>
    );
};

const WalletsBanner = () => {
    // just for testing purpose
    const [migration_status, setMigrationStatus] = React.useState<TWalletsMigrationStatus>('eligible');
    const [is_eu, setIsEu] = React.useState(false);

    // just for testing purpose too
    const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <React.Fragment>
            <BannerSwitcher
                status={migration_status}
                onChangeStatus={setMigrationStatus}
                is_eu={is_eu}
                onChangeEU={setIsEu}
            />
            {children}
        </React.Fragment>
    );

    switch (migration_status) {
        // the user can upgrade to the wallets
        case 'eligible':
        case 'failed':
            return (
                <Wrapper>
                    <WalletsBannerUpgrade />
                </Wrapper>
            );
        // the wallets upgrading is in progress
        case 'in_progress':
            return (
                <Wrapper>
                    <WalletsBannerUpgrading is_eu={is_eu} />
                </Wrapper>
            );
        // the wallets upgrading completed
        case 'migrated':
            return (
                <Wrapper>
                    <WalletsBannerReady is_eu={is_eu} />
                </Wrapper>
            );
        // the user can't upgrade to the wallets
        default:
            return <Wrapper />;
    }
};

export default WalletsBanner;
