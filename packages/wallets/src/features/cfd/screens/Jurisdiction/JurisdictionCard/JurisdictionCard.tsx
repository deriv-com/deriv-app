import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import DocumentsIcon from '../../../../../public/images/ic-documents.svg';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../../../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import { useDynamicLeverageModalState } from '../../../components/DynamicLeverageContext';
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

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();
    const { getModalState } = useModal();

    const descriptionClickHandler = (tag?: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.stopPropagation();
        if (tag === 'dynamicLeverage') {
            toggleDynamicLeverage();
        } else {
            setIsFlipped(true);
        }
    };

    const { contents, header, isOverHeaderAvailable, overHeader, verificationDocs } = useMemo<TJurisdictionCardItems>(
        () => getJurisdictionContents()[jurisdiction],
        [jurisdiction]
    );
    const marketType = getModalState('marketType') || 'all';
    const rows = contents[marketType] || [];

    const parseDescription = (row: TJurisdictionCardSection) => {
        if (row.clickableDescription)
            return row.clickableDescription.map(description => {
                if (description.type === 'link') {
                    return (
                        <a
                            className='wallets-jurisdiction-card__link'
                            key={description.text}
                            onClick={descriptionClickHandler(description.tag)}
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
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    {isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
                    <div className='wallets-jurisdiction-card-front__label'>
                        <WalletText align='center' size='lg' weight='bold'>
                            {header}
                        </WalletText>
                    </div>
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
                                                          return (
                                                              <div key={`verification-doc-${doc}`}>
                                                                  {verificationIconsMapper[doc]}
                                                              </div>
                                                          );
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
