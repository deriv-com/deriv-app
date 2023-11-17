import React from 'react';
import ClearPhoto from '../../../../../../public/images/accounts/clear-photo.svg';
import ClockIcon from '../../../../../../public/images/accounts/clock-icon.svg';
import ImageIcon from '../../../../../../public/images/accounts/image-icon.svg';
import LessThanEightIcon from '../../../../../../public/images/accounts/less-than-eight-icon.svg';
import { DocumentRuleHint } from './DocumentRuleHint';
import './DocumentRuleHints.scss';

type TProps = {
    docType: 'drivingLicense' | 'identityCard' | 'nimcSlip' | 'passport';
};

const DocumentRuleHints: React.FC<TProps> = ({ docType }) => (
    <div className='wallets-document-rule-hints'>
        <DocumentRuleHint description='A clear colour photo or scanned image' icon={<ClearPhoto />} />
        <DocumentRuleHint description='JPEG, JPG, PNG, PDF, or GIF' icon={<ImageIcon />} />
        <DocumentRuleHint description='Less than 8MB' icon={<LessThanEightIcon />} />
        {docType !== 'nimcSlip' && (
            <DocumentRuleHint description='Must be valid for at least 6 months' icon={<ClockIcon />} />
        )}
    </div>
);

export default DocumentRuleHints;
