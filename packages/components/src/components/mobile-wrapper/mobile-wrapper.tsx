import React from 'react';
import { observer, useStore } from '@deriv/stores';

type TMobileWrapper = {
    children: React.ReactNode;
};

const MobileWrapper = observer(({ children }: TMobileWrapper) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return is_mobile ? <React.Fragment>{children}</React.Fragment> : null;
});

export default MobileWrapper;
