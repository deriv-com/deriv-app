import React from 'react';
import SVGMigrationBanner from './svg-migration-banner';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';

const AppstoreBanner = () => {
    const { has_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();

    return <SVGMigrationBanner />;
};

export default AppstoreBanner;
