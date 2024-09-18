import React from 'react';
import { DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../Base';
import './WalletsErrorMT5InvestorPassword.scss';

type TProps = {
    actionButtons?: React.ComponentProps<typeof ActionScreen>['actionButtons'];
    errorMessage: string;
    title: string;
};

const WalletsErrorMT5InvestorPassword: React.FC<TProps> = ({ actionButtons, errorMessage, title }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <ModalStepWrapper
            renderFooter={!isDesktop ? () => actionButtons : undefined}
            shouldHideFooter={isDesktop}
            title={localize('Reset {{title}} password', { title })}
        >
            <div className='wallets-error-mt5-investor-password'>
                <ActionScreen
                    actionButtons={isDesktop ? actionButtons : undefined}
                    description={errorMessage}
                    icon={<DerivLightIcDxtradePasswordIcon height={100} width={100} />}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletsErrorMT5InvestorPassword;
