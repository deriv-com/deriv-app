import React from 'react';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import SVGMigrationBanner from './svg-migration-banner';

const AppstoreBanner = observer(() => {
    const { has_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();

    return has_svg_accounts_to_migrate ? <SVGMigrationBanner /> : null;
});

export default AppstoreBanner;
