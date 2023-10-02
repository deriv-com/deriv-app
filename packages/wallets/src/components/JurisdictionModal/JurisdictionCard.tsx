import React from 'react';
import classNames from 'classnames';
import JurisdictionCardRow from './JurisdictionCardRow';
import JurisdictionCardTag from './JurisdictionCardTag';
import './JurisdictionCard.scss';

type TJurisdictionCardProps = {
    isSelected: boolean;
    jurisdiction: string;
    onSelect: (clickedJurisdiction: string) => void;
    tag?: string;
};

const JurisdictionCard: React.FC<TJurisdictionCardProps> = ({ isSelected, jurisdiction, onSelect, tag }) => {
    const [shouldFlip, setShouldFlip] = useState(false);

    return (
        <div
            className={classNames('wallets-jurisdiction-card', {
                'wallets-jurisdiction-card--flip': shouldFlip,
                'wallets-jurisdiction-card--selected': isSelected,
            })}
            onClick={() => onSelect(jurisdiction)}
        >
            {!shouldFlip && tag && <JurisdictionCardTag tag={tag} />}
            <React.Fragment>
                <div className='wallets-jurisdiction-card-front'>
                    <div className='wallets-jurisdiction-card-front__label'>{jurisdiction}</div>
                    <JurisdictionCardRow
                        description='Synthetics,baskets,and derived FX'
                        renderTag={() => (
                            <div className='wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--assets'>
                                40+
                            </div>
                        )}
                        title='Assets'
                    />
                    <JurisdictionCardRow
                        description={<div className='wallets-jurisdiction-card__link'>Dynamic leverage</div>}
                        renderTag={() => (
                            <div className='wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--leverage'>
                                1:1000
                            </div>
                        )}
                        title='Leverage'
                    />

                    <JurisdictionCardRow
                        renderTag={() => (
                            <div className='wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--spreads-from'>
                                0.6 pips
                            </div>
                        )}
                        title='Spreads from'
                    />
                    <JurisdictionCardRow
                        description={
                            <div>
                                <a className='wallets-jurisdiction-card__link' onClick={() => setShouldFlip(true)}>
                                    Learn more
                                </a>{' '}
                                about required verifications.
                            </div>
                        }
                        title='Verifications'
                    />
                    <JurisdictionCardRow
                        description='British Virgin Islands Financial Services Commission (Licence no. SIBA/L/18/1114)'
                        title='Regulator'
                    />
                </div>
                <div className='wallets-jurisdiction-card-back'>IM BACK</div>
            </React.Fragment>
        </div>
    );
};

export default JurisdictionCard;
