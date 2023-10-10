import React, { useState } from 'react';
import classNames from 'classnames';
import JurisdictionCardRow from './JurisdictionCardRow';
import JurisdictionCardTag from './JurisdictionCardTag';
import { getJurisdictionContents } from './jurisdiction-contents/jurisdiction-contents';
import { jurisdictionVerificationContents } from './jurisdiction-contents/jurisdiction-verification-contents';
import { useModal } from '../ModalProvider';
import SelfieIcon from '../../public/images/ic-selfie.svg';
import DocumentsIcon from '../../public/images/ic-documents.svg';
import IdCardIcon from '../../public/images/ic-id-card.svg';
import './JurisdictionCard.scss';

type TJurisdictionCardProps = {
    isSelected: boolean;
    jurisdiction: string;
    onSelect: (clickedJurisdiction: string) => void;
    tag?: string;
};

const verificationIconsMapper = {
    selfie: <SelfieIcon />,
    documentNumber: <IdCardIcon />,
    nameAndAddress: <DocumentsIcon />,
    notApplicable: <SelfieIcon />,
};

const JurisdictionCard: React.FC<TJurisdictionCardProps> = ({ isSelected, jurisdiction, onSelect }) => {
    const [shouldFlip, setShouldFlip] = useState(false);
    const [verificationContents, setVerificationContents] = useState([]);
    const { modalState } = useModal();

    const { isOverHeaderAvailable, header, overHeader, contents, verificationDocs } =
        getJurisdictionContents()[jurisdiction];

    console.log(modalState, getJurisdictionContents()[jurisdiction]);
    const rows = contents[modalState?.marketType || 'all'];

    const parseClickableDescription = (clickableDescription: { type: 'text' | 'link'; text: string }[]) => {
        return clickableDescription.map(description => {
            if (description.type === 'link') {
                return (
                    <a className='wallets-jurisdiction-card__link' onClick={() => setShouldFlip(true)}>
                        {description.text}{' '}
                    </a>
                );
            } else {
                return description.text;
            }
        });
    };

    return (
        <div
            className={classNames('wallets-jurisdiction-card', {
                'wallets-jurisdiction-card--flip': shouldFlip,
                'wallets-jurisdiction-card--selected': isSelected,
            })}
            onClick={() => {
                if (verificationDocs[modalState?.marketType || 'all']) {
                    console.log(verificationDocs);
                    setVerificationContents(verificationDocs[modalState?.marketType || 'all']);
                }
                onSelect(jurisdiction);
            }}
        >
            {!shouldFlip && isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    <div className='wallets-jurisdiction-card-front__label'>{header}</div>
                    {rows.map(row => {
                        return (
                            <JurisdictionCardRow
                                description={
                                    row.clickable_description
                                        ? parseClickableDescription(row.clickableDescription)
                                        : row.description
                                }
                                renderTag={() => {
                                    if (!row?.titleIndicators) return;

                                    if (row.titleIndicators?.type === 'displayIcons') {
                                        return (
                                            <div className='wallets-jurisdiction-card-front__tag-icons'>
                                                {verificationDocs?.[modalState?.marketType || 'financial'].map(doc => {
                                                    return verificationIconsMapper[doc];
                                                })}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            className={`wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--${
                                                row.titleIndicators?.displayTextSkinColor || ''
                                            }`}
                                        >
                                            {row.titleIndicators?.displayText}
                                        </div>
                                    );
                                }}
                                title={row.title}
                            />
                        );
                    })}
                </div>
                <div className='wallets-jurisdiction-card-back'>
                    {jurisdictionVerificationContents().shortDescription}
                    {verificationContents.map(verificationDocument => {
                        return <div>{verificationDocument}</div>;
                    })}
                </div>
            </React.Fragment>
        </div>
    );
};

export default JurisdictionCard;
