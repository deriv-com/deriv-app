import React             from 'react';
import Loading           from '../../_common/components/loading.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const EconomicCalendar = () => (
    <div id='economic_calendar' className='static_full'>
        <h1>{it.L('Economic Calendar')}</h1>
        <div className='gr-padding-10'>
            <div className='calendar-container'>
                <div id='economicCalendarWidget'>
                    <Loading />
                </div>
                <div className='calendar-footer invisible'>
                    {/* Update anchor links below in case they become outdated */}
                    <div className='left'>
                        <a href='https://www.mql5.com?utm_source=calendar.widget&amp;utm_medium=logo&amp;utm_term=mql5.website&amp;utm_content=visit.mql5.website&amp;utm_campaign=202.calendar.widget' className='logo' target='_blank' rel='noopener noreferrer'>MQL5</a>
                        <span className='desc'>
                            <a href='https://www.mql5.com/en/economic-calendar?utm_source=calendar.widget&utm_medium=link&utm_term=mql5.calendar&utm_content=visit.mql5.calendar&utm_campaign=202.calendar.widget' target='_blank' rel='noopener noreferrer'><span>{it.L('Economic Calendar')}</span></a>
                        </span>
                    </div>
                    <div className='right'>
                        <a className='social-links' href='https://www.facebook.com/sharer/sharer.php?u=https%3a%2f%2fwww.mql5.com%2fen%2feconomic-calendar%3futm_source%3dwww.facebook.com%26utm_campaign%3den.calendar.sharing.desktop' target='_blank' rel='noopener noreferrer'><i className='fb' /></a>
                        <a className='social-links' href='https://twitter.com/intent/tweet?text=Economic+calendar+-+economic+indicators+and+events&url=https%3a%2f%2fwww.mql5.com%2fen%2feconomic-calendar%3futm_source%3dwww.twitter.com%26utm_campaign%3den.calendar.sharing.desktop' target='_blank' rel='noopener noreferrer'><i className='twitter' /></a>
                    </div>
                </div>
            </div>
        </div>
        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);
export default EconomicCalendar;
