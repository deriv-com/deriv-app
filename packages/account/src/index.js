// TODO lazy-load these components
import PersonalDetails from 'Sections/Profile/PersonalDetails';
import FinancialAssessment from 'Sections/Profile/FinancialAssessment';
import ProofOfIdentity from 'Sections/Verification/ProofOfIdentity';
import ProofOfAddress from 'Sections/Verification/ProofOfAddress';
import DerivPassword from 'Sections/Security/DerivPassword';
import AccountLimits from 'Sections/Security/AccountLimits';
import ProofOfIdentityContainer from 'Sections/Verification/ProofOfIdentity/proof-of-identity-container.jsx';
import { FormSubHeader, FormBody, FormFooter } from 'Components/layout-components.jsx';
import MultiStep from 'Components/multistep.jsx';
import Account from 'Containers/account.jsx';
import App from './App.jsx';

export default {
    App,
    PersonalDetails,
    ProofOfIdentityContainer,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    DerivPassword,
    AccountLimits,
    FormSubHeader,
    FormBody,
    FormFooter,
    MultiStep,
    Account,
};
