import { Localize, useTranslations } from '@deriv-com/translations';
import AccountArticle from '../article';

const getDescription = () => [
    <Localize key={0} i18n_default_text='These are default limits that we apply to your accounts.' />,
];

const AccountLimitsArticle = () => {
    const { localize } = useTranslations();
    return <AccountArticle title={localize('Account limits')} descriptions={getDescription()} />;
};

export default AccountLimitsArticle;
