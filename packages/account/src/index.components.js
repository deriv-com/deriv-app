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
import { poa_status_codes } from 'Sections/Verification/ProofOfAddress/proof-of-address-container.jsx';
import {
    Expired,
    NeedsReview,
    Unverified,
    Verified,
    Submitted,
} from 'Sections/Verification/ProofOfAddress/proof-of-address-messages.jsx';
import FileUploaderContainer from 'Sections/Verification/ProofOfAddress/file-uploader-container.jsx';

export default {
    PersonalDetails,
    ProofOfIdentityContainer,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    DerivPassword,
    AccountLimits,
    FormBody,
    FormFooter,
    MultiStep,
    Account,
    Expired,
    NeedsReview,
    Unverified,
    Verified,
    Submitted,
    poa_status_codes,
    FileUploaderContainer,
    FormSubHeader,
};
