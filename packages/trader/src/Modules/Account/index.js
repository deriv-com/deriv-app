// TODO: lazy load these sub components
export { default as PersonalDetails } from 'Modules/Account/Sections/Profile/PersonalDetails';
export { default as FinancialAssessment } from 'Modules/Account/Sections/Profile/FinancialAssessment';
export { default as ProofOfIdentity } from 'Modules/Account/Sections/Verification/ProofOfIdentity';
export { default as ProofOfAddress } from 'Modules/Account/Sections/Verification/ProofOfAddress';
export { default as DerivPassword } from 'Modules/Account/Sections/Security/DerivPassword';
export { default as AccountLimits } from 'Modules/Account/Sections/Security/AccountLimits';

export default from './Containers/account-lazy.jsx';
