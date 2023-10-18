import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../components/Base/WalletText';
import { useModal } from '../../../../../components/ModalProvider';
import DocumentsIcon from '../../../../../public/images/ic-documents.svg';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../../../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import { getJurisdictionContents } from '../jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardItems, TJurisdictionCardSection } from '../jurisdiction-contents/props.types';
import JurisdictionCardBack from './JurisdictionCardBack';
import JurisdictionCardRow from './JurisdictionCardRow';
import JurisdictionCardTag from './JurisdictionCardTag';
import './JurisdictionCard.scss';

type TJurisdictionCardProps = {
    isSelected: boolean;
    jurisdiction: string;
    onSelect: (clickedJurisdiction: string) => void;
    tag?: string;
};

const verificationIconsMapper: Record<string, JSX.Element> = {
    documentNumber: <IdCardIcon />,
    nameAndAddress: <DocumentsIcon />,
    notApplicable: <NotApplicableIcon />,
    selfie: <SelfieIcon />,
};

const JurisdictionCard: React.FC<TJurisdictionCardProps> = ({ isSelected, jurisdiction, onSelect }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const { modalState } = useModal();

    const { contents, header, isOverHeaderAvailable, overHeader, verificationDocs } = useMemo<TJurisdictionCardItems>(
        () => getJurisdictionContents()[jurisdiction],
        [jurisdiction]
    );
    const marketType = modalState?.marketType || 'all';
    const rows = contents[marketType] || [];

    const parseDescription = (row: TJurisdictionCardSection) => {
        if (row.clickableDescription)
            return row.clickableDescription.map(description => {
                if (description.type === 'link') {
                    return (
                        <a
                            className='wallets-jurisdiction-card__link'
                            key={description?.text}
                            onClick={e => {
                                e.stopPropagation();
                                setIsFlipped(true);
                            }}
                        >
                            {description.text}{' '}
                        </a>
                    );
                }
                return description.text;
            });
        return row.description;
    };

    return (
        <div
            className={classNames('wallets-jurisdiction-card', {
                'wallets-jurisdiction-card--flip': isFlipped,
                'wallets-jurisdiction-card--selected': isSelected,
            })}
            onClick={() => {
                onSelect(jurisdiction);
            }}
        >
            {!isFlipped && isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    <div className='wallets-jurisdiction-card-front__label'>{header}</div>
                    {rows.map(row => {
                        return (
                            <JurisdictionCardRow
                                description={parseDescription(row)}
                                key={`wallets-jurisdiction-card--${row?.title}`}
                                renderTag={() => {
                                    if (!row?.titleIndicators) return;

                                    if (
                                        row.titleIndicators?.type === 'displayIcons' &&
                                        verificationDocs &&
                                        marketType &&
                                        marketType !== 'all'
                                    ) {
                                        return (
                                            <div className='wallets-jurisdiction-card-front__tag-icons'>
                                                {!(marketType in verificationDocs)
                                                    ? verificationIconsMapper.notApplicable
                                                    : verificationDocs[marketType]?.map(doc => {
                                                          return verificationIconsMapper[doc];
                                                      })}
                                            </div>
                                        );
                                    }

                                    if (row?.titleIndicators?.displayText) {
                                        return (
                                            <div
                                                className={`wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--${
                                                    row.titleIndicators?.displayTextSkinColor || ''
                                                }`}
                                            >
                                                <WalletText color='white' size='xs' weight='bold'>
                                                    {row.titleIndicators.displayText}
                                                </WalletText>
                                            </div>
                                        );
                                    }
                                }}
                                title={row.title}
                            />
                        );
                    })}
                </div>
                {marketType && marketType !== 'all' && verificationDocs && (
                    <JurisdictionCardBack setIsFlipped={setIsFlipped} verificationDocs={verificationDocs[marketType]} />
                )}
            </React.Fragment>
        </div>
    );
};

export default JurisdictionCard;
