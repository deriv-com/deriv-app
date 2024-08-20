import React from 'react';
import { DerivLightIcDxtradePasswordIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsErrorMT5InvestorPassword.scss';

type TProps = {
    errorMessage: string;
    renderButtons?: React.ComponentProps<typeof WalletsActionScreen>['renderButtons'];
    title: string;
};

const WalletsErrorMT5InvestorPassword: React.FC<TProps> = ({ errorMessage, renderButtons, title }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <ModalStepWrapper
            renderFooter={!isDesktop ? renderButtons : undefined}
            shouldHideFooter={isDesktop}
            title={localize('Reset {{title}} password', { title })}
        >
            <div className='wallets-error-mt5-investor-password'>
                <WalletsActionScreen
                    description={errorMessage}
                    icon={<DerivLightIcDxtradePasswordIcon height={100} width={100} />}
                    renderButtons={isDesktop ? renderButtons : undefined}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletsErrorMT5InvestorPassword;
