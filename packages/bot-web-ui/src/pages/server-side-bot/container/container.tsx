import React from 'react';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import LoginModal from '../bot-list/common/login-modal';

type TContainer = {
    children: React.ReactElement;
};

const Container: React.FC<TContainer> = observer(({ children }) => {
    return <div className='ssb-container'>{children}</div>;
});

export default Container;
