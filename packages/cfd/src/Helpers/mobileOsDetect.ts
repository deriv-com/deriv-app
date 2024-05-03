declare global {
    interface Window {
        opera?: string;
        MSStream?: {
            readonly type: string;
            msClose: () => void;
            msDetachStream: () => void;
        };
    }
    interface Navigator {
        userAgentData?: NavigatorUAData;
    }
}

interface NavigatorUAData {
    brands: Array<{ brand: string; version: string }>;
    mobile: boolean;
    getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>;
}

type HighEntropyValues = {
    platform?: string;
    platformVersion?: string;
    model?: string;
    uaFullVersion?: string;
};

export const mobileOsDetect = async () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const huaweiDevicesRegex =
        /\b(ALP-|AMN-|ANA-|ANE-|ANG-|AQM-|ARS-|ART-|ATU-|BAC-|BLA-|BRQ-|CAG-|CAM-|CAN-|CAZ-|CDL-|CDY-|CLT-|CRO-|CUN-|DIG-|DRA-|DUA-|DUB-|DVC-|ELE-|ELS-|EML-|EVA-|EVR-|FIG-|FLA-|FRL-|GLK-|HMA-|HW-|HWI-|INE-|JAT-|JEF-|JER-|JKM-|JNY-|JSC-|LDN-|LIO-|LON-|LUA-|LYA-|LYO-|MAR-|MED-|MHA-|MLA-|MRD-|MYA-|NCE-|NEO-|NOH-|NOP-|OCE-|PAR-|PIC-|POT-|PPA-|PRA-|RNE-|SEA-|SLA-|SNE-|SPN-|STK-|TAH-|TAS-|TET-|TRT-|VCE-|VIE-|VKY-|VNS-|VOG-|VTR-|WAS-|WKG-|WLZ-|JAD-|MLD-|RTE-|NAM-|NEN-|BAL-|JLN-|YAL|MGA-|FGD-|XYAO-|BON-|ALN-|ALT-|BRA-|DBY2-|STG-|MAO-|LEM-|GOA-|FOA-|MNA-|LNA-)\b/i;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        // Check if navigator.userAgentData is available for modern browsers
        if (navigator?.userAgentData) {
            const ua = await navigator.userAgentData.getHighEntropyValues(['model']);
            if (huaweiDevicesRegex.test(ua?.model || '')) {
                return 'huawei';
            }
        } else if (huaweiDevicesRegex.test(userAgent) || /huawei/i.test(userAgent)) {
            return 'huawei';
        }
        return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }
};
