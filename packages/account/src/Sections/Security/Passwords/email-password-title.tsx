import { Text } from '@deriv/components';
import {
    AccountsDerivXIcon,
    BrandDerivLogoCoralIcon,
    LegacyEmailIcon,
    PartnersProductBrandLightDerivMt5LogoIcon,
} from '@deriv/quill-icons';

type TEmailPasswordTitleProps = {
    icon: string;
    title: string;
};

const EmailPasswordTitle = ({ icon, title }: TEmailPasswordTitleProps) => {
    const displayIcon = {
        deriv_email: <LegacyEmailIcon iconSize='sm' />,
        deriv_password: <BrandDerivLogoCoralIcon height={24} width={24} />,
        deriv_mt5_password: <PartnersProductBrandLightDerivMt5LogoIcon height={24} width={24} />,
        deriv_x_password: <AccountsDerivXIcon iconSize='sm' />,
    };

    return (
        <div className='email-password-title-wrapper'>
            {displayIcon[icon as keyof typeof displayIcon]}
            <Text weight='bold' size='xs'>
                {title}
            </Text>
        </div>
    );
};

export default EmailPasswordTitle;
