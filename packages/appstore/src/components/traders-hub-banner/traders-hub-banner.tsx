import React from 'react';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import MigrationBanner from './migration-banner';

const TradersHubBanner = observer(() => {
    const { has_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();

    return has_svg_accounts_to_migrate ? <MigrationBanner /> : null;
});

export default TradersHubBanner;
