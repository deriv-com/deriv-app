import React from 'react';
import { PlatformContext } from '@deriv/shared';
import SelfExclusionComponent from 'Components/self-exclusion/self-exclusion';
import 'Components/self-exclusion/self-exclusion.scss';

const SelfExclusion = props => {
    const { is_appstore } = React.useContext(PlatformContext);
    return <SelfExclusionComponent is_appstore={is_appstore} {...props} />;
};

export default SelfExclusion;
