import React from 'react';
import { Icon } from '@deriv/components';
import './trustpilot-star-rating.scss';

const TrustpilotStarRating = ({ score }: { score: number }) => {
    return (
        <div className='trustpilot-star-rating'>
            {[...Array(5)].map((_, idx) => (
                <div
                    className='trustpilot-star-rating__item'
                    key={`star-${idx}`}
                    style={{
                        background: `linear-gradient(90deg, #00b67a ${(score - idx) * 100}%, #dcdce5 ${
                            (score - idx) * 100
                        }%)`,
                    }}
                >
                    <Icon icon='IcAppstoreTrustpilotStar' size={24} />
                </div>
            ))}
        </div>
    );
};

export default TrustpilotStarRating;
