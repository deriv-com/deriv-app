import React               from 'react';
import { BoxOverlayImage } from '../../_common/components/box_row.jsx';
import ImageSlider         from '../../_common/components/image_slider.jsx';

const Malta = () =>  (
    <div className='static_full location-malta'>
        <div className='introduction'>
            <div className='container gr-row gr-padding-20'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h1>{it.L('Malta')}</h1>
                    <h4 className='subheader'>{it.L('Historical Mediterranean island')}</h4>
                </div>
                <div className='gr-12 gr-padding-20 gr-centered'>
                    <div className='gr-row'>
                        <div className='gr-5 gr-12-p gr-12-m'>
                            <img className='responsive' src={it.url_for('images/pages/careers/malta/introduction-malta.jpg')} />
                        </div>
                        <div className='gr-7 gr-12-p gr-12-m'>
                            <p className='no-margin-top'>{it.L('The Republic of Malta is an island country in Southern Europe — located approximately 80km south of Italy. Its rich, colourful history can be traced back thousands of years to the Neolithic period.')}</p>
                            <p>{it.L('Malta\'s strategic location in the Mediterranean Sea saw it occupied by a number of foreign powers, including the Greeks, Romans, Arabs, French, and most recently, the British. It gained independence from the British in 1964, and joined the European Union in 2004. Today, Malta is a popular tourist destination and a high-income country powered by an industrialised, service-based economy.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='living fill-bg-color'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Living in Malta')}</h2>
                </div>
                <div className='gr-12'>
                    <div className='container center-text'>
                        <ImageSlider
                            images={[
                                {
                                    url    : 'images/pages/careers/malta/smallest-capital.jpg',
                                    caption: it.L('Malta is one of the most densely-populated countries in the world with the smallest capital (Valletta) in the European Union. Maltese and English are the country\'s official languages, while Italian is also widely spoken. Malta has plenty of sunshine throughout the year and enjoys a mild climate.'),
                                },
                                {
                                    url    : 'images/pages/careers/malta/festivities.jpg',
                                    caption: it.L('Life in Malta moves at a slower pace with a number of colourful festivities and religious holidays that you can look forward to every year. Some of the most popular ones include the Notte Bianca, the Malta Jazz Festival, Christmas, and Easter. Malta has no shortage of museums, archaeological sites, and other places of interest if you\'re looking for a culture fix.'),
                                },
                                {
                                    url    : 'images/pages/careers/malta/cost-of-living.jpg',
                                    caption: it.L('The cost of living in Malta is relatively affordable; food and public transportation are much cheaper than what you\'ll find in a major European city. Malta offers free healthcare but queues at public healthcare facilities are less than ideal. Fortunately, health insurance is easily affordable and provides you with access to private clinics and hospitals.'),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='misc'>
            <div className='container gr-row gr-padding-30 center-text'>
                <div className='gr-12 gr-padding-20 center-text'>
                    <h2>{it.L('Can\'t miss in Malta')}</h2>
                </div>
                <BoxOverlayImage
                    title={it.L('Natural wonders')}
                    text={it.L('Malta\'s natural attractions are absolutely breathtaking, from its sheer cliffs and lush valleys to its golden sandy beaches and underwater structures in clear blue seas.')}
                    img_src={it.url_for('images/pages/careers/malta/natural-wonders.jpg')}
                />
                <BoxOverlayImage
                    alignment='right'
                    title={it.L('Festivals galore')}
                    text={it.L('Malta celebrates a large number of religious festivities and cultural events every year, filling the streets with carts laden with traditional sweets and delicacies.')}
                    img_src={it.url_for('images/pages/careers/malta/festivals-galore.jpg')}
                />
            </div>
        </div>
    </div>
);

export default Malta;
