/* eslint-disable no-console */
import { observer } from '@deriv/stores';

type TSupportedDocument = {
    document_type: string;
    display_name: string;
    format: string;
    example_format: string;
    lifetime_valid: boolean;
    sides: string[];
    available_services: string[];
};
type TIdvDocumentSubmitProps = {
    supported_documents: TSupportedDocument[];
};

const IdvDocumentSubmit = observer(({ supported_documents }: TIdvDocumentSubmitProps) => {
    console.log(supported_documents);
    return <div>IdvDocumentSubmit</div>;
});

export default IdvDocumentSubmit;
