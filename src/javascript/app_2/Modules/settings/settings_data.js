import { localize }           from '_common/localize';
import PersonalSvg            from 'Images/app_2/settings/ic-personal-details.svg';
import FinancialSvg           from 'Images/app_2/settings/ic-financial-assesment.svg';
import AccountSvg             from 'Images/app_2/settings/ic-account-password.svg';
import CashierSvg             from 'Images/app_2/settings/ic-cashier-password.svg';
import SelfSvg                from 'Images/app_2/settings/ic-self-exclusion.svg';
import LimitsSvg              from 'Images/app_2/settings/ic-limits.svg';
import LoginSvg               from 'Images/app_2/settings/ic-login-history.svg';
import ApiSvg                 from 'Images/app_2/settings/ic-api-token.svg';
import AuthorisedSvg          from 'Images/app_2/settings/ic-authorised-applications.svg';
import AccountPassword        from './sections/account-password.jsx';
import ApiToken               from './sections/api-token.jsx';
import AuthorizedApplications from './sections/authorized-applications.jsx';
import CashierPassword        from './sections/cashier-password.jsx';
import FinancialAssessment    from './sections/financial-assessment.jsx';
import Limits                 from './sections/limits.jsx';
import LoginHistory           from './sections/login-history.jsx';
import PersonalDetails        from './sections/personal-details.jsx';
import SelfExclusion          from './sections/self-exclusion.jsx';

const data = [
    {
        title: localize('Profile'),
        items: [
            {
                title      : localize('Personal Details'),
                description: localize('View your personal information.'),
                Icon       : PersonalSvg,
                Component  : PersonalDetails,
            },
            {
                title      : localize('Financial Assessment'),
                description: localize('View your financial assessment settings'),
                Icon       : FinancialSvg,
                Component  : FinancialAssessment,
            },
        ],
    },
    {
        title: localize('Security & Limits'),
        items: [
            {
                title      : localize('Account Password'),
                description: localize('Change your main login password.'),
                Icon       : AccountSvg,
                Component  : AccountPassword,
            },
            {
                title      : localize('Cashier Password'),
                description: localize('Change the password used for deposits and withdrawals'),
                Icon       : CashierSvg,
                Component  : CashierPassword,
            },
            {
                title      : localize('Self Exclusion'),
                description: localize('Facility that allows you to set limits on your account.'),
                Icon       : SelfSvg,
                Component  : SelfExclusion,
            },
            {
                title      : localize('Limits'),
                description: localize('View your trading and withdrawal limits'),
                Icon       : LimitsSvg,
                Component  : Limits,
            },
            {
                title      : localize('Login History'),
                description: localize('View your login history'),
                Icon       : LoginSvg,
                Component  : LoginHistory,
            },
            {
                title      : localize('API Token'),
                description: localize('API token for third party applications'),
                Icon       : ApiSvg,
                Component  : ApiToken,
            },
            {
                title      : localize('Authorized Applications'),
                description: localize('Manage your authorised applications'),
                Icon       : AuthorisedSvg,
                Component  : AuthorizedApplications,
            },
        ],
    },
];

export default data;
