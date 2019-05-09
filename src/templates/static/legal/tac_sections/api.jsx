import React from 'react';
import ListNested from '../../../_common/components/list_nested.jsx';

const Api = () => (
    <div>
        <h2 data-anchor='api-terms-and-conditions'>{it.L('[_1] Application Programme Interface ("API") terms and conditions', it.website_name)}</h2>
        <p>{it.L('This document (the "Agreement") sets out the terms and conditions ("Terms") between "the Company" which is Binary Services Ltd, and "the Programmer" (the person who registered for the [_1] Application Programme Interface ("API").', it.website_name)}</p>
        <ol className='reset_ol'>
            <ListNested
                strong='1'
                header={it.L('Definitions')}
                items={[
                    { text: it.L('"[_1] API" means the [_1] proprietary set of programmatic routines, protocols, tools, and resources created and maintained by [_1] that allows the Programmer to use a registered Application to interface with the [_1] trading platform.', it.website_name) },
                    { text: it.L('"Content" means any data or content either from the Company\'s Website or accessed via the API. The Company\'s "Website" means [_1]\'s website at www.binary.com and any other website or service owned or operated [_1].', it.website_name) },
                    { text: it.L('"Third-party Provider(s)" means the third party (non-affiliated) entity that makes available features and functions through use of the [_1] API.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('About the Company and these Terms')}
                items={[
                    { text: it.L('The Programmer agrees that, by developing on the [_1] API, the Programmer is entering into a legally binding agreement with the Company.', it.website_name) },
                    { text: it.L('By registering a software application, website, or product that the Programmer creates or a service that the Programmer offers (an "Application"), the Programmer acknowledges that the Programmer has read and understood and agreed to be bound by these Terms.') },
                    { text: it.L('If the Programmer is developing on the Company\'s API on behalf of a company or other entity, the Programmer represents and warrants that the Programmer has full legal authority to register an Application on behalf of that entity and bind it to these Terms. If the Programmer is not authorised, the Programmer may not accept these Terms or register an Application for someone else.') },
                    {
                        header     : it.L('Limited license grant'),
                        list_nested: [
                            { text: it.L('As long as the Programmer follows these Terms, the Company grants the Programmer a limited, non-exclusive, non-assignable, non-transferable, terminable licence to use the [_1] API to develop, test, and support the Programmer\'s Application and to let the Programmer\'s customers use the Programmer\'s integration of the [_1] API within the Programmer\'s Application.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Agreement restrictions'),
                        list_nested: [
                            {
                                header     : it.L('The Programmer agrees that the Programmer will not'),
                                list_nested: [
                                    { text: it.L('Sublicense any of the rights granted under these Terms, other than as permitted by these Terms') },
                                    { text: it.L('Use or reproduce the [_1] API other than as permitted by these Terms', it.website_name) },
                                    { text: it.L('Use the [_1] API for any purpose that violates any law or regulation or any right of any person, including but not limited to intellectual property rights, rights of privacy, or rights of personality, or is in any manner inconsistent with these Terms or privacy policy', it.website_name) },
                                ],
                            },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Scope and intent')}
                items={[
                    { text: it.L('This Agreement governs the Programmer\'s use of the Company\'s API unless the Programmer has executed another agreement with the Company that expressly governs the Programmer\'s use of the Company\'s API.') },
                    { text: it.L('The Programmer may develop Applications using the [_1] API as soon as the Programmer registers an Application and agrees to follow these Terms.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Storage of content')}
                items={[
                    { text: it.L('The Programmer is not allowed to store any Content (such as feed data).') },
                    { text: it.L('The Programmer may store the Application-specific alphanumeric user IDs provided ("API Tokens") or the authentication tokens provided via Open Authorisation Standard ("OAuth Tokens").') },
                    { text: it.L('The Programmer may cache the Content for up to 24 hours from a request for that Content through the [_1] API.', it.website_name) },
                    { text: it.L('If this Agreement is terminated for any reason, the Programmer must permanently delete all Content, except when doing so would cause the Programmer to violate any law or obligation imposed by a governmental authority.') },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Usage limit')}
                items={[
                    { text: it.L('The [_1] API has usage limits enforced to prevent abuse and/or repurposing of the [_1] API. These usage limits may be changed in the future without notice. If the Programmer consistently exceeds the usage limit or otherwise abuse the service, the Company may block the Programmer\'s access to the [_1] API.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Follow the law and these Terms')}
                items={[
                    {
                        header     : it.L('Legal compliance'),
                        list_nested: [
                            { text: it.L('The Programmer represents and warrants to the Company that, excluding the Content, the Programmer has the right to use, reproduce, transmit, copy, publicly display, publicly perform, and distribute the Programmer\'s Application, and that the use or promotion of the Programmer\'s Application will not violate the rights of any third party (e.g. copyright, patent, trademark, privacy, publicity, or other proprietary right of any person or entity) or any applicable regulation or law and the laws of any country in which the Programmer\'s Application is made available.') },
                        ],
                    },
                    {
                        header     : it.L('Compliance with and amendments to these Terms'),
                        list_nested: [
                            { text: it.L('The Programmer must comply with these Terms in order to use the [_1] API.', it.website_name) },
                            { text: it.L('The Company reserves the right to modify, supplement, or replace these Terms at any time. The Programmer will be notified of any material changes. The Programmer\'s continued registration with the [_1] API and the Programmer\'s continued use of the [_1] API will constitute binding acceptance of such changes.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Other obligations'),
                        list_nested: [
                            {
                                header     : it.L('The Programmer and the Programmer\'s Application must also comply with the following, which are hereby incorporated by reference:'),
                                list_nested: [
                                    { text: it.L('The [_1] terms and conditions', it.website_name) },
                                    { text: it.L('The [_1] privacy and security policy', it.website_name) },
                                    { text: it.L('The [_1] order execution policy', it.website_name) },
                                ],
                            },
                            { text: it.L('If the Programmer is an affiliate of [_1], the Programmer must also comply with [_1]\'s Affiliate Programme terms and conditions.', it.website_name) },
                            { text: it.L('In the event of any conflict between the content in this document and the above documents, this document controls the Programmer\'s use of the [_1] API. If the Programmer disagrees with any of the provisions in these Terms, the Programmer must not access or use the [_1] API.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Ownership')}
                items={[
                    {
                        header     : it.L('[_1] property', it.website_name),
                        list_nested: [
                            { text: it.L('As between the Programmer and the Company, the Company owns all rights, title, and interest, including all intellectual property rights, in and to, the [_1] API and all elements, components, and executables of the [_1] API.', it.website_name) },
                            { text: it.L('The Programmer\'s use of the [_1] API will not confer to the Programmer any title, ownership interest, or intellectual property rights that otherwise belong to the Company. The Company\'s trading platform is protected under patent and the Company\'s website, including its content, is protected by copyright laws, and will remain the Company\'s exclusive property, as applicable.', it.website_name) },
                            { text: it.L('Except for the licence granted in this Agreement, the Company does not grant the Programmer any right, title, or interest in the [_1] API. The Programmer agrees to take such actions as the Company may reasonably request to perfect the Company\'s rights to the [_1] API.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('The Programmer\'s property', it.website_name),
                        list_nested: [
                            { text: it.L('Except to the extent that the Programmer\'s Application contains the [_1] API, the Company claims no ownership or control over the Programmer\'s Application.', it.website_name) },
                            {
                                header     : it.L('During the term of this Agreement, the Programmer grants the Company a royalty-free, non-exclusive, worldwide, irrevocable right, under all of the Programmer\'s intellectual property rights, to do the following:'),
                                list_nested: [
                                    { text: it.L('Publish the Programmer\'s name and logo (with or without a link to the Programmer\'s Application) on the Company\'s website, in press releases, and in promotional materials without additional consent.') },
                                    { text: it.L('Use, perform, and display the Programmer\'s Application and its content for purposes of marketing, demonstrating, and making the Programmer\'s Application available to the Company\'s clients.') },
                                    { text: it.L('Link to and direct the Company\'s clients to the Programmer\'s Application.') },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Contributions to the [_1] API', it.website_name),
                        list_nested: [
                            {
                                header     : it.L('By submitting suggestions or other feedback regarding the [_1] API to the Company ("Contributions"), the Programmer acknowledges and agrees to the following:', it.website_name),
                                list_nested: [
                                    { text: it.L('The Company is not under any obligation of confidentiality with respect to the Contributions.') },
                                    { text: it.L('The Company may use or disclose (or choose not to use or disclose) such Contributions for any purpose, in any way, in any media worldwide.') },
                                    { text: it.L('The Programmer irrevocably and non-exclusively licenses to the Company rights to use the Programmer\'s Contributions.') },
                                    { text: it.L('The Programmer is not entitled to any compensation or reimbursement of any kind from the Company under any circumstances.') },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Improvements'),
                        list_nested: [
                            { text: it.L('The Programmer also acknowledges that [_1] may continue to make changes to and enhance the [_1] API and that those changes and enhancements will be owned by [_1]. The Programmer hereby assigns and transfers to the Company all of the Programmer\'s rights, title, and interest in and to any modifications or derivative works of the [_1] API created by or for the Programmer, regardless of whether they were created in accordance with these Terms; such assignment being effective upon creation of such works, and shall include, without limitation, all rights under any intellectual property laws, including copyright. The Programmer shall not take any action to jeopardise, encumber, limit, or interface in any manner with [_1]\'s ownership of, and rights with respect to, the [_1] API, or any derivative works or updates thereof or thereto. Any components, parts, or mechanics of any system or API programme derived from the [_1] API, or [_1]\'s business practices shall belong solely to [_1]. Further, the Programmer will not, at any time, contest or assist any third party in contesting the rights of [_1] in the [_1] API or any other intellectual property provided in these Terms.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Revisions to the [_1] API', it.website_name),
                        list_nested: [
                            { text: it.L('The Company may release subsequent versions of the [_1] API and require that the Programmer use those subsequent versions. The Programmer\'s continued use of the APIs following a subsequent release will be deemed the Programmer\'s acceptance of modifications.', it.website_name) },
                            { text: it.L('The Programmer shall discontinue the Programmer\'s use of all prior versions of the [_1] API in favour of the revised [_1] API. While it is the Company\'s intention that the revised [_1] API shall be backward compatible with the immediately prior version of the [_1] API, the Company does not guarantee or warrant that this shall be so, and the Company shall have no liability whatsoever to the Programmer for any failure of the revised [_1] API to be backward compatible with any prior version of the [_1] API.', it.website_name) },
                            { text: it.L('The Company may change, suspend, terminate, or discontinue any aspect of the [_1] API, including the availability of any services, information features, or functions accessible by means of the [_1] API, on no less than seven days\' advance notice to the Programmer.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Limitations on liability')}
                items={[
                    {
                        header     : it.L('The use of the [_1] API is at the Programmer\'s own risk, and the Programmer assumes full responsibility and risk of the loss it may suffer as a result of using, or accessing, the [_1] API. Except to the extent that liability under any applicable law or regulation cannot be excluded, the following cases hold:', it.website_name),
                        list_nested: [
                            { text: it.L('The Company is not liable for loss or damage of any kind whatsoever arising as a result of information or prices published on or furnished through the [_1] API, or any errors or omissions of the [_1] API.', it.website_name) },
                            { text: it.L('The Company shall have no liability arising from orders, investment decisions, or purchases of third-party goods or services (including financial instruments and currency) based on information published on or furnished through the [_1] API.', it.website_name) },
                            { text: it.L('Under no circumstances shall the Company or its directors or employees be liable under this agreement to the Programmer or any third party for any indirect, special, incidental, punitive, or consequential loss or damages or any other similar damages under any theory of liability (whether in contract, tort, strict liability, or any other theory), which are directly or indirectly attributable to the use of, or the inability to use, the [_1] API, or any content contained thereon, even if the Company has been informed of the possibility thereof.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Disclaimers')}
                items={[
                    {
                        header     : it.L('Warranty disclaimer'),
                        list_nested: [
                            { text: it.L('The Company provides the [_1] API on an "as is" and "as available" basis with no warranties, either express or implied, of any kind. To the fullest extent permissible under applicable law, the Company disclaims any and all warranties and representations, including, without limitation, any implied warranties of merchantability, fitness for a particular purpose, title, accuracy of data, and non-infringement.', it.website_name) },
                            { text: it.L('The Company does not guarantee that the [_1] API it provides will function without interruption or errors in functioning. In particular, the operation of the [_1] API may be interrupted due to maintenance, updates, or system or network failures. The Company disclaims all liability for damages caused by any such interruption or errors in functioning.', it.website_name) },
                            { text: it.L('Furthermore, the Company disclaims all liability for any malfunctioning, impossibility of access, or poor use conditions of the [_1] API due to inappropriate equipment, disturbances related to Internet service providers, the saturation of the Internet network, and any other reason.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Security disclaimer'),
                        list_nested: [
                            { text: it.L('The Programmer acknowledges and agrees that the Programmer is solely and exclusively responsible for the control, operation, and security of transactions and communications made through access to or use of the [_1] API. The Programmer acknowledges that there are risks associated with utilising an Internet-based deal execution trading system including, but not limited to, the failure of hardware, software, and Internet connections. The Programmer acknowledges that the Company does not control signal power, its reception or routing via the Internet, the configuration of the Programmer\'s equipment, or the reliability of its connection, and the Company shall not be responsible for any communication failures, disruptions, errors, distortions, or delays the Programmer may experience when trading via the Internet using the [_1] API.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Indemnification')}
                items={[
                    {
                        header     : it.L('The Programmer shall be solely responsible for, and shall indemnify and hold the Company free and harmless from, any and all third-party claims, damages, or lawsuits (including, but not limited to, consequential losses and loss of profit and the Company\'s reasonable legal costs and expenses if applicable):'),
                        list_nested: [
                            { text: it.L('The Programmer or the Programmer\'s employees\' or agents\' acts or omissions, including the Programmer\'s or their breach or alleged breach of these Terms') },
                            { text: it.L('The Programmer\'s breach of any of [_1]\'s rights', it.website_name) },
                            { text: it.L('The Programmer\'s violation of any applicable law, rule, or regulation') },
                            { text: it.L('Any failure on the Programmer\'s part to maintain the security of any security devices or procedures used in or in association with the [_1] API', it.website_name) },
                            { text: it.L('The use, operation, or combination of the [_1] API with non-[_1] API(s), data, equipment, or documentation if liability would have been avoided but for such use, operation, or combination', it.website_name) },
                            { text: it.L('Any third-party claims arising out of, or relating to, the Programmer\'s use of, or inability to use, the [_1] API', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Confidentiality')}
                items={[
                    { text: it.L('The Programmer acknowledges that, in the course of dealing under these Terms, the Programmer may obtain confidential information relating to the Company and its parent, subsidiaries, affiliates, or other third parties. Such confidential information shall belong solely to the Company.') },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Security')}
                items={[
                    {
                        text: it.L('The Programmer must promptly report any security deficiencies in, or intrusions to, the Programmer\'s Application that the Programmer discovers to [_1] by writing in to [_2] or by raising a discussion thread on [_3] which is part of our Developer Site. The Programmer will work with [_1] to immediately correct any security deficiency and will immediately disconnect any intrusions or intruder. In the event of any security deficiency or intrusion involving the Application, APIs, or Content, the Programmer will make no public statements (e.g. press, blogs, social media, bulletin boards, etc.) without prior written and express permission from [_1] in each instance.', it.website_name,
                            '<a href="https://hackerone.com/binary" target="_blank" rel="noopener noreferrer">Hackerone</a>', '<a href="https://binary.vanillacommunity.com" target="_blank" rel="noopener noreferrer">Vanilla Community</a>'),
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Term and termination')}
                items={[
                    {
                        header     : it.L('Term'),
                        list_nested: [
                            { text: it.L('This Agreement shall commence on the date that the Programmer first accepts this Agreement and shall continue unless and until terminated in accordance with the term and termination conditions set forth in this Agreement.') },
                        ],
                    },
                    {
                        header     : it.L('Right to terminate'),
                        list_nested: [
                            {
                                header     : it.L('At any time and for any reason or no reason, the Company, in its sole discretion, may do either of the following immediately:'),
                                list_nested: [
                                    { text: it.L('Terminate the Programmer\'s use of the [_1] API', it.website_name) },
                                    { text: it.L('Terminate this Agreement') },
                                ],
                            },
                            { text: it.L('The Programmer may terminate this Agreement at any time, but only by giving the Company a minimum of seven days\' written notice. "Written notice" here includes notice delivered by regular mail or by email.') },
                        ],
                    },
                    {
                        header     : it.L('Termination causes'),
                        list_nested: [
                            {
                                header     : it.L('The following are causes for termination:'),
                                list_nested: [
                                    { text: it.L('The Programmer is in default or breach of any covenant, obligation, or condition contained in this Agreement, and such default is not cured within seven days of receipt of written notice from the Company.') },
                                    { text: it.L('The Programmer\'s use of the [_1] API causes damage to the [_1] trading platform, then [_1] may, at its option, forthwith suspend the Programmer\'s use of the [_1] API and/or terminate this Agreement without further written notice.', it.website_name) },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Effect of termination'),
                        list_nested: [
                            { text: it.L('Upon the expiration or termination of this Agreement, for whatever reason, all rights and licences granted to the Programmer in this Agreement, including use of the [_1] API, shall immediately terminate. The Programmer agrees to promptly cease all further use of the [_1] API. Termination of this Agreement shall not act as a waiver of any breach of this Agreement and shall not act as a release of the Programmer\'s liability for the breach of the Programmer\'s obligation under this Agreement. The Company shall not be liable to the Programmer for damages of any kind solely as a result of terminating this Agreement in accordance with its terms.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('General provisions')}
                items={[
                    {
                        header     : it.L('Severability'),
                        list_nested: [
                            { text: it.L('If any provision of these Terms is found to be illegal, void, or unenforceable, the unenforceable provision will be modified so as to render it enforceable to the maximum extent possible in order to effect the intention of the provision; if a term cannot be so modified, it will be severed and the remaining provisions of these Terms will not be affected in any way.') },
                        ],
                    },
                    { text: it.L('If the Programmer is entering into this Agreement on behalf of the Programmer\'s employer or other entity, the Programmer represents and warrants that the Programmer has full legal authority to bind the Programmer\'s employer or such entity to this Agreement.') },
                    { text: it.L('The Programmer may not assign rights granted in this Agreement without the Company\'s prior written approval.') },
                ]}
            />
        </ol>
    </div>
);

export default Api;
