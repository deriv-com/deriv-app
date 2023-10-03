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

const verification_icons_mapper = {
    selfie: <SelfieIcon />,
    document_number: <IdCardIcon />,
    name_and_address: <DocumentsIcon />,
    not_applicable: <SelfieIcon />,
};

const JurisdictionCard: React.FC<TJurisdictionCardProps> = ({ isSelected, jurisdiction, onSelect }) => {
    const [shouldFlip, setShouldFlip] = useState(false);
    const [verificationContents, setVerificationContents] = useState({
        financial: [],
        synthetic: [],
    });
    const { modalState } = useModal();

    const {
        is_over_header_available,
        header,
        over_header,
        financial_contents,
        swapfree_contents,
        synthetic_contents,
        verification_docs,
    } = getJurisdictionContents()[jurisdiction];

    const contents = React.useMemo(
        () => ({
            financial: financial_contents,
            all: swapfree_contents,
            synthetic: synthetic_contents,
        }),
        [jurisdiction]
    );

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
                if (contents[modalState?.marketType || 'all'].verification_docs) {
                    setVerificationContents(contents[modalState?.marketType || 'all'].verification_docs);
                }
                onSelect(jurisdiction);
            }}
        >
            {!shouldFlip && is_over_header_available && <JurisdictionCardTag tag={over_header || ''} />}
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    <div className='wallets-jurisdiction-card-front__label'>{header}</div>
                    {contents[modalState?.marketType || 'all'].map(content => {
                        return (
                            <JurisdictionCardRow
                                description={
                                    content.clickable_description
                                        ? parseClickableDescription(content.clickable_description)
                                        : content.description
                                }
                                renderTag={() => {
                                    if (!content?.title_indicators) return;

                                    if (content.title_indicators?.type === 'displayIcons') {
                                        return (
                                            <div className='wallets-jurisdiction-card-front__tag-icons'>
                                                {verification_docs &&
                                                    verification_docs[modalState?.marketType || 'financial'].map(
                                                        doc => {
                                                            return verification_icons_mapper[doc];
                                                        }
                                                    )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            className={`wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--${
                                                content.title_indicators?.display_text_skin_color || ''
                                            }`}
                                        >
                                            {content.title_indicators?.display_text}
                                        </div>
                                    );
                                }}
                                title={content.title}
                            />
                        );
                    })}
                </div>
                {/* verification_docs: {
        synthetic: ['document_number', 'name_and_address'],
        financial: ['document_number', 'name_and_address'],
    }, */}
                <div className='wallets-jurisdiction-card-back'>
                    {jurisdictionVerificationContents.short_description}
                    {verificationContents[modalState?.marketType || 'all'].map(verificationDocument => {
                        return <div>{verificationDocument}</div>;
                    })}
                </div>
            </React.Fragment>
        </div>
    );
};

export default JurisdictionCard;
