import React, { useMemo } from 'react';
import classNames from 'classnames';
import DocumentsIcon from '../../public/images/ic-documents.svg';
import IdCardIcon from '../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../public/images/ic-selfie.svg';
import { useModal } from '../ModalProvider';
import { getJurisdictionContents } from './jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardItems } from './jurisdiction-contents/props.types';
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
    const { modalState } = useModal();

    const { contents, header, isOverHeaderAvailable, overHeader, verificationDocs } = useMemo<TJurisdictionCardItems>(
        () => getJurisdictionContents()[jurisdiction],
        [jurisdiction]
    );
    const marketType = modalState?.marketType || 'all';
    const rows = contents[marketType] || [];

    const parseClickableDescription = (clickableDescription: { text: string; type: 'link' | 'text' }[]) => {
        return clickableDescription.map(description => {
            if (description.type === 'link') {
                return (
                    <a className='wallets-jurisdiction-card__link' key={description?.text}>
                        {description.text}{' '}
                    </a>
                );
            }
            return description.text;
        });
    };

    return (
        <div
            className={classNames('wallets-jurisdiction-card', {
                'wallets-jurisdiction-card--selected': isSelected,
            })}
            onClick={() => {
                onSelect(jurisdiction);
            }}
        >
            {isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    <div className='wallets-jurisdiction-card-front__label'>{header}</div>
                    {rows.map(row => {
                        return (
                            <JurisdictionCardRow
                                description={
                                    row.clickableDescription
                                        ? parseClickableDescription(row.clickableDescription)
                                        : row.description
                                }
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
                                                {row.titleIndicators?.displayText}
                                            </div>
                                        );
                                    }
                                }}
                                title={row.title}
                            />
                        );
                    })}
                </div>
            </React.Fragment>
        </div>
    );
};

export default JurisdictionCard;
