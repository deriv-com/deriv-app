import UAParser from 'ua-parser-js';

declare global {
    interface Window {
        MSStream?: {
            msClose: () => void;
            msDetachStream: () => void;
            readonly type: string;
        };
        opera?: string;
    }
    interface Navigator {
        userAgentData?: NavigatorUAData;
    }
}

type NavigatorUAData = {
    brands: { brand: string; version: string }[];
    getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>;
    mobile: boolean;
};

type HighEntropyValues = {
    model?: string;
    platform?: string;
    platformVersion?: string;
    uaFullVersion?: string;
};

// Simple regular expression to match potential Huawei device codes
const huaweiDevicesRegex = /\b([A-Z]{3}-)\b/gi;

// Set of valid Huawei device codes
const validCodes = new Set([
    'ALP-',
    'AMN-',
    'ANA-',
    'ANE-',
    'ANG-',
    'AQM-',
    'ARS-',
    'ART-',
    'ATU-',
    'BAC-',
    'BLA-',
    'BRQ-',
    'CAG-',
    'CAM-',
    'CAN-',
    'CAZ-',
    'CDL-',
    'CDY-',
    'CLT-',
    'CRO-',
    'CUN-',
    'DIG-',
    'DRA-',
    'DUA-',
    'DUB-',
    'DVC-',
    'ELE-',
    'ELS-',
    'EML-',
    'EVA-',
    'EVR-',
    'FIG-',
    'FLA-',
    'FRL-',
    'GLK-',
    'HMA-',
    'HW-',
    'HWI-',
    'INE-',
    'JAT-',
    'JEF-',
    'JER-',
    'JKM-',
    'JNY-',
    'JSC-',
    'LDN-',
    'LIO-',
    'LON-',
    'LUA-',
    'LYA-',
    'LYO-',
    'MAR-',
    'MED-',
    'MHA-',
    'MLA-',
    'MRD-',
    'MYA-',
    'NCE-',
    'NEO-',
    'NOH-',
    'NOP-',
    'OCE-',
    'PAR-',
    'PIC-',
    'POT-',
    'PPA-',
    'PRA-',
    'RNE-',
    'SEA-',
    'SLA-',
    'SNE-',
    'SPN-',
    'STK-',
    'TAH-',
    'TAS-',
    'TET-',
    'TRT-',
    'VCE-',
    'VIE-',
    'VKY-',
    'VNS-',
    'VOG-',
    'VTR-',
    'WAS-',
    'WKG-',
    'WLZ-',
    'JAD-',
    'MLD-',
    'RTE-',
    'NAM-',
    'NEN-',
    'BAL-',
    'JLN-',
    'YAL-',
    'MGA-',
    'FGD-',
    'XYAO-',
    'BON-',
    'ALN-',
    'ALT-',
    'BRA-',
    'DBY2-',
    'STG-',
    'MAO-',
    'LEM-',
    'GOA-',
    'FOA-',
    'MNA-',
    'LNA-',
]);

// Function to validate Huawei device codes from a string
function validateHuaweiCodes(inputString: string) {
    const matches = inputString.match(huaweiDevicesRegex);
    if (matches) {
        return matches.filter(code => validCodes.has(code.toUpperCase())).length > 0;
    }
    return false;
}

export const mobileOSDetectAsync = async () => {
    const userAgent = navigator.userAgent ?? window.opera ?? '';
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        // Check if navigator.userAgentData is available for modern browsers
        if (navigator?.userAgentData) {
            const ua = await navigator.userAgentData.getHighEntropyValues(['model']);
            if (validateHuaweiCodes(ua?.model || '')) {
                return 'huawei';
            }
        } else if (validateHuaweiCodes(userAgent) || /huawei/i.test(userAgent)) {
            return 'huawei';
        }
        return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
};

export const getOSNameWithUAParser = () => UAParser().os.name;
