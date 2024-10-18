import { Text } from '@deriv/components';
import { AccountsDerivXIcon, BrandDerivLogoCoralIcon, LegacyEmailIcon } from '@deriv/quill-icons';

type TEmailPasswordTitleProps = {
    icon: string;
    title: string;
};

const EmailPasswordTitle = ({ icon, title }: TEmailPasswordTitleProps) => {
    const displayIcon = {
        email: <LegacyEmailIcon iconSize='sm' />,
        deriv_password: <BrandDerivLogoCoralIcon height={24} width={24} />,
        deriv_mt5_password: <BrandDerivLogoCoralIcon height={24} width={24} />,
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
