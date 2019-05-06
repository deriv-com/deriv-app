import React from 'react';
import ListNested from '../../../_common/components/list_nested.jsx';

const Api = () => (
    <div>
        <h2 data-anchor='api-terms-and-conditions'>{it.L('[_1] Application Program Interface ("API") Terms and Conditions', it.website_name)}</h2>
        <p>{it.L('This document (the "Agreement") sets out the terms and conditions ("Terms") between "the Company" which is Binary Services Ltd ("we," "us," and "our"), and you (the person who registered for the [_1] Application Program Interface ("API"); "you", or "your").', it.website_name)}</p>
        <ol className='reset_ol'>
            <ListNested
                strong='1'
                header={it.L('Definitions')}
                items={[
                    { text: it.L('"[_1] API" means the [_1] proprietary set of programmatic routines, protocols, tools and resources created and maintained by [_1] that allows you to use a registered Application to interface with the [_1] trading platform.', it.website_name) },
                    { text: it.L('"Content" means any data or content from our Website or accessed via the API. Our "Website" means [_1]\'s website at www.binary.com and any other website or service owned or operated by [_1].', it.website_name) },
                    { text: it.L('"Third Party Provider(s)" means the third party (non-affiliated) entity that makes available features and functions through use of the [_1] API.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('About Us and These Terms')}
                items={[
                    { text: it.L('You agree that by developing on the [_1] API, you are entering into a legally binding agreement with the Company.', it.website_name) },
                    { text: it.L('By registering a software application, website, or product you create or a service you offer (an "Application"), you acknowledge that you have read and understood and agree to be bound by these terms.') },
                    { text: it.L('If you are developing on our API on behalf of a company or other entity, you represent and warrant that you have full legal authority to register an Application on behalf of that entity and bind it to these Terms. If you are not authorized, you may not accept these Terms or register an Application for someone else.') },
                    {
                        header     : it.L('Limited License Grant'),
                        list_nested: [
                            { text: it.L('As long as you follow these Terms, we grant you a limited, non-exclusive, non-assignable, non-transferable, terminable license to use the [_1] API to develop, test, and support your Application, and to let your customers use your integration of the [_1] API within your Application.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Agreement Restrictions'),
                        list_nested: [
                            {
                                header     : it.L('You agree that you will not:'),
                                list_nested: [
                                    { text: it.L('sublicense any of the rights granted under these Terms, other than as permitted by these Terms;') },
                                    { text: it.L('use or reproduce the [_1] API other than as permitted by these Terms; or', it.website_name) },
                                    { text: it.L('use the [_1] API for any purpose that violates any law or regulation, any right of any person, including but not limited to intellectual property rights, rights of privacy or rights of personality, or in any manner inconsistent with these Terms or privacy policy.', it.website_name) },
                                ],
                            },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Scope and Intent')}
                items={[
                    { text: it.L('This Agreement governs your use of our API unless you have executed another agreement with the Company that expressly governs your use of our API.') },
                    { text: it.L('You may develop Applications using the [_1] API as soon as you register an Application and you agree to follow these Terms.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Storage of Content')}
                items={[
                    { text: it.L('You are not allowed to store any Content (such as feed data).') },
                    { text: it.L('You may store the Application-specific alphanumeric user IDs provided ("API Tokens") or the authentication tokens provided via Open Authorisation Standard ("OAuth Tokens").') },
                    { text: it.L('You may cache the Content for up to 24 hours from a request for that Content through the [_1] API.', it.website_name) },
                    { text: it.L('If this Agreement is terminated for any reason, you must permanently delete all Content, except when doing so would cause you to violate any law or obligation imposed by a governmental authority.') },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Usage Limit')}
                items={[
                    { text: it.L('The [_1] API has usage limits enforced to prevent abuse and/or repurposing of the [_1] API. These usage limits may be changed in the future without notice. If you consistently exceed the usage limit or otherwise abuse the service, we may block your access to the [_1] API.', it.website_name) },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Follow the Law and These Terms')}
                items={[
                    {
                        header     : it.L('Legal Compliance'),
                        list_nested: [
                            { text: it.L('You represent and warrant to the Company that, excluding the Content, you have the right to use, reproduce, transmit, copy, publicly display, publicly perform, and distribute your Application, and that use or promotion of your Application will not violate the rights of any third party (e.g., copyright, patent, trademark, privacy, publicity or other proprietary right of any person or entity), or any applicable regulation or law, and the laws of any country in which your Application is made available.') },
                        ],
                    },
                    {
                        header     : it.L('Compliance with and Amendments to These Terms'),
                        list_nested: [
                            { text: it.L('You must comply with these Terms in order to use the [_1] API.', it.website_name) },
                            { text: it.L('We reserve the right to modify, supplement, or replace these Terms at any time. Any material changes will be notified to you. Your continued registration with the [_1] API and your continued use of the [_1] API will constitute binding acceptance of such changes.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Other Obligations'),
                        list_nested: [
                            {
                                header     : it.L('You and your Application must also comply with the following, which are hereby incorporated by reference:'),
                                list_nested: [
                                    { text: it.L('The [_1] Terms and Conditions;', it.website_name) },
                                    { text: it.L('The [_1] Privacy and Security Policy;', it.website_name) },
                                    { text: it.L('The [_1] Order Execution Policy.', it.website_name) },
                                ],
                            },
                            { text: it.L('If you are an affiliate of [_1], you must also comply with the [_1] Affiliate Programme Terms and Conditions.', it.website_name) },
                            { text: it.L('In the event of any conflict between the content in this document and the above documents, this document controls your use of the [_1] API. If you disagree with any of the provisions in these Terms, do not access or use the [_1] API.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Ownership')}
                items={[
                    {
                        header     : it.L('[_1] Property', it.website_name),
                        list_nested: [
                            { text: it.L('As between you and us, we own all rights, title, and interest, including all intellectual property rights, in and to, the [_1] API, and all elements, components, and executables of the [_1] API.', it.website_name) },
                            { text: it.L('Your use of the [_1] API will not confer to you any title, ownership interest or intellectual property rights that otherwise belongs to the Company. Our trading platform is protected under patent and our website, including its content, is protected by copyright laws, and will remain our exclusive property, as applicable.', it.website_name) },
                            { text: it.L('Except for the license granted in this Agreement, the Company does not grant you any right, title, or interest in the [_1] API. You agree to take such actions as the Company may reasonably request to perfect the Company\'s rights to the [_1] API.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Your Property', it.website_name),
                        list_nested: [
                            { text: it.L('Except to the extent your Application contains the [_1] API, the Company claims no ownership or control over your Application.', it.website_name) },
                            {
                                header     : it.L('During the term of this Agreement, you grant us a royalty-free, non-exclusive, worldwide, irrevocable right, under all of your intellectual property rights, to:'),
                                list_nested: [
                                    { text: it.L('Publish your name and logo (with or without a link to your Application) on our website, in press releases, and in promotional materials without additional consent;') },
                                    { text: it.L('Use, perform, and display your Application and its content for purposes of marketing, demonstrating, and making your Application available to our clients; and    ') },
                                    { text: it.L('Link to and direct our clients to your Application.') },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Contributions to the [_1] API', it.website_name),
                        list_nested: [
                            {
                                header     : it.L('By submitting suggestions or other feedback regarding the [_1] API to the Company ("Contributions"), you acknowledge and agree that:', it.website_name),
                                list_nested: [
                                    { text: it.L('The Company is not under any obligation of confidentiality with respect to the Contributions;') },
                                    { text: it.L('The Company may use or disclose (or choose not to use or disclose) such Contributions for any purpose, in any way, in any media worldwide;') },
                                    { text: it.L('You irrevocably, non-exclusively license to the Company rights to use your Contributions; and') },
                                    { text: it.L('You are not entitled to any compensation or reimbursement of any kind from the Company under any circumstances.') },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Improvements'),
                        list_nested: [
                            { text: it.L('You also acknowledge that [_1] may continue to make changes to and enhance the [_1] API and that those changes and enhancements will be owned by [_1]. You hereby assign and transfer to the Company all of your right, title and interest in and to any modifications or derivative works of the [_1] API created by or for you, regardless of whether they were created in accordance with these Terms; such assignment being effective upon creation of such works, and shall include, without limitation, all rights under any intellectual property laws, including copyright. You shall not take any action to jeopardise, encumber, limit or interface in any manner with [_1]\'s ownership of and rights with respect to the [_1] API, or any derivative works or updates thereof or thereto. Any components, parts, or mechanics of any system or API program derived from the [_1] API, or [_1]\'s business practices shall belong solely to [_1]. Further, you will not, at any time, contest or assist any other third party in contesting the rights of [_1] in the [_1] API or any other intellectual property provided in these Terms.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Revisions to the [_1] API', it.website_name),
                        list_nested: [
                            { text: it.L('We may release subsequent versions of the [_1] API and require that you use those subsequent versions. Your continued use of the APIs following a subsequent release will be deemed your acceptance of modifications.', it.website_name) },
                            { text: it.L('You shall discontinue your use of all prior versions of the [_1] API in favour of the revised [_1] API. While it is the Company\'s intention that the revised [_1] API shall be backward compatible with the immediately prior version of the [_1] API, the Company does not guarantee or warrant that this shall be so, and the Company shall have no liability whatsoever to you for any failure of the revised [_1] API to be backward compatible with any prior version of the [_1] API.', it.website_name) },
                            { text: it.L('The Company may change, suspend, terminate or discontinue any aspect of the [_1] API, including the availability of any services, information features or functions accessible by means of the [_1] API, on no less than seven days advance notice to you.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Limitations on Liability')}
                items={[
                    {
                        header     : it.L('The use of the [_1] API is at your own risk, and you assume full responsibility and risk of loss it may suffer as a result of using, or accessing the [_1] API. Except to the extent that liability under any applicable law or regulation cannot be excluded:', it.website_name),
                        list_nested: [
                            { text: it.L('The Company is not liable for loss or damage of any kind whatsoever arising as a result of information or prices published on or furnished through the [_1] API, or any errors or omissions of the [_1] API;', it.website_name) },
                            { text: it.L('The Company shall have no liability arising from orders, investment decisions or purchases of third party goods or services (including financial instruments and currency) based on information published on or furnished through the [_1] API;', it.website_name) },
                            { text: it.L('Under no circumstances shall the Company or its directors or employees be liable under this agreement to you or any third party for any indirect, special, incidental, punitive or consequential loss or damages or any other similar damages under any theory of liability (whether in contract, tort, strict liability or any other theory), that are directly or indirectly attributable to the use of, or the inability to use, the [_1] API, or any content contained thereon, even if the Company has been informed of the possibility thereof.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Disclaimers')}
                items={[
                    {
                        header     : it.L('Warranty Disclaimer'),
                        list_nested: [
                            { text: it.L('The Company provides the [_1] API on an "as is" and "as available" basis with no warranties, either express or implied, of any kind. To the fullest extent permissible under applicable law, the Company disclaim any and all warranties and representations, including, without limitation, any implied warranties of merchantability, fitness for a particular purpose, title, accuracy of data, and non-infringement.', it.website_name) },
                            { text: it.L('The Company does not guarantee that the [_1] API it provides will function without interruption or errors in functioning. In particular, the operation of the [_1] API may be interrupted due to maintenance, updates, or system or network failures. The Company disclaims all liability for damages caused by any such interruption or errors in functioning.', it.website_name) },
                            { text: it.L('Furthermore, the Company disclaims all liability for any malfunctioning, impossibility of access, or poor use conditions of the [_1] API due to inappropriate equipment, disturbances related to internet service providers, to the saturation of the internet network, and for any other reason.', it.website_name) },
                        ],
                    },
                    {
                        header     : it.L('Security Disclaimer'),
                        list_nested: [
                            { text: it.L('You acknowledge and agree that you are solely and exclusively responsible for the control, operation and security of transactions and communications made through its access to or use of the [_1] API. You acknowledge that there are risks associated with utilising an internet-based deal execution trading system including, but not limited to, the failure of hardware, software, and internet connections. You acknowledge that the Company does not control signal power, its reception or routing via the internet, configuration of your equipment or reliability of its connection, and the Company shall not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience when trading via the internet using the [_1] API.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Indemnification')}
                items={[
                    {
                        header     : it.L('You shall be solely responsible for, and shall indemnify and hold the Company free and harmless from, any and all third party claims, damages or lawsuits (including, but not limited to, consequential losses and loss of profit, the Company\'s reasonable legal costs and expenses if applicable):'),
                        list_nested: [
                            { text: it.L('You or your employees\' or agents\' acts or omissions, including yours or their breach or alleged breach of these Terms;') },
                            { text: it.L('Your breach of any of [_1]\'s rights;', it.website_name) },
                            { text: it.L('Your violation of any applicable law, rule or regulation;') },
                            { text: it.L('Any failure on your part to maintain the security of any security devices or procedures used in or in association with the [_1] API;', it.website_name) },
                            { text: it.L('The use, operation or combination of the [_1] API with non-[_1] API(s), data, equipment or documentation if liability would have been avoided but for such use, operation, or combination; or', it.website_name) },
                            { text: it.L('Any third party claims arising out of, or relating to, your use of, or inability to use, the [_1] API.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Confidentiality')}
                items={[
                    { text: it.L('You acknowledge that, in the course of dealing under these Terms, you may obtain confidential information relating to the Company and its parent, subsidiaries, affiliates or other third party. Such confidential information shall belong solely to the Company.') },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Security')}
                items={[
                    { text: it.L('You must promptly report any security deficiencies in, or intrusions to, your Application that you discover to [_1] by writing in to [_2] or by raising a discussion  thread on [_3] which is part of our Developer Site. You will work with [_1] to immediately correct any security deficiency, and will immediately disconnect any intrusions or intruder. In the event of any security deficiency or intrusion involving the Application, APIs or Content, you will make no public statements (e.g. press, blogs, social media, bulletin boards, etc.) without prior written and express permission from [_1] in each instance.', it.website_name,
                        '<a href="https://hackerone.com/binary" target="_blank" rel="noopener noreferrer">Hackerone</a>','<a href="https://binary.vanillacommunity.com" target="_blank" rel="noopener noreferrer">Vanilla Community</a>') },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('Term and Termination')}
                items={[
                    {
                        header     : it.L('Term'),
                        list_nested: [
                            { text: it.L('This Agreement shall commence on the date you first accept this Agreement, and shall continue unless and until terminated in accordance with the Term and Termination conditions set forth in this Agreement.') },
                        ],
                    },
                    {
                        header     : it.L('Right to Terminate'),
                        list_nested: [
                            {
                                header     : it.L('At any time and for any reason or no reason, the Company, in its sole discretion, may immediately:'),
                                list_nested: [
                                    { text: it.L('Terminate your use of the [_1] API; or', it.website_name) },
                                    { text: it.L('Terminate this Agreement') },
                                ],
                            },
                            { text: it.L('You may terminate this Agreement at any time, but only by giving the Company a minimum of seven days written notice. "Written notice" here includes notice delivered by regular letter mail or by email.') },
                        ],
                    },
                    {
                        header     : it.L('Termination for Causes'),
                        list_nested: [
                            {
                                header     : it.L('If:'),
                                list_nested: [
                                    { text: it.L('You are in default or breach of any covenant, obligation or condition contained in this Agreement, and if such default is not cured within seven days of receipt of written notice from the Company;') },
                                    { text: it.L('Your use of the [_1] API causes damage to the [_1] trading platform, then [_1] may, at its option, forthwith suspend your use of the [_1] API and/or terminate this Agreement without further written notice.', it.website_name) },
                                ],
                            },
                        ],
                    },
                    {
                        header     : it.L('Effect of Termination'),
                        list_nested: [
                            { text: it.L('Upon the expiration or termination of this Agreement, for whatever reason, all rights and license granted to you in this Agreement, including use of the [_1] API, shall immediately terminate. You agree to promptly cease all further use of the [_1] API. Termination of this Agreement shall not act as a waiver of any breach of this Agreement and shall not act as a release of your liability for breach of its obligation under this Agreement. The Company shall not be liable to you for damages of any kind solely as a result of terminating this Agreement in accordance with its terms.', it.website_name) },
                        ],
                    },
                ]}
            />

            <ListNested
                strong='1'
                header={it.L('General Provisions')}
                items={[
                    {
                        header     : it.L('Severability'),
                        list_nested: [
                            { text: it.L('If any provision of these Terms is found to be illegal, void, or unenforceable, the unenforceable provision will be modified so as to render it enforceable to the maximum extent possible in order to effect the intention of the provision; if a term cannot be so modified, it will be severed and the remaining provisions of these Terms will not be affected in any way.') },
                        ],
                    },
                    { text: it.L('If you are entering into this Agreement on behalf of your employer or other entity, you represent and warrant that you have full legal authority to bind your employer or such entity to this Agreement.') },
                    { text: it.L('You may not assign rights granted in this Agreement without the Company\'s prior written approval.') },
                ]}
            />
        </ol>
    </div>
);

export default Api;
