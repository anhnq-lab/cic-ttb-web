/**
 * UTM Tracking Utility
 * Captures and stores UTM parameters from URL for lead attribution
 */

export interface UTMParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    referrer?: string;
    landing_page?: string;
    first_visit?: string;
}

const UTM_STORAGE_KEY = 'utm_params';

/**
 * Parse UTM parameters from current URL
 */
export const parseUTMParams = (): UTMParams => {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    const utmParams: UTMParams = {};

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmKeys.forEach(key => {
        const value = params.get(key);
        if (value) {
            (utmParams as any)[key] = value;
        }
    });

    return utmParams;
};

/**
 * Save UTM params to localStorage (first-touch attribution)
 */
export const saveUTMParams = (): void => {
    if (typeof window === 'undefined') return;

    // Check if we already have saved params (first-touch)
    const existingParams = localStorage.getItem(UTM_STORAGE_KEY);
    if (existingParams) return; // Keep first-touch params

    const currentParams = parseUTMParams();

    // Only save if there are UTM params
    if (Object.keys(currentParams).length > 0) {
        const enrichedParams: UTMParams = {
            ...currentParams,
            referrer: document.referrer || 'direct',
            landing_page: window.location.pathname,
            first_visit: new Date().toISOString()
        };

        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(enrichedParams));
    }
};

/**
 * Get saved UTM params
 */
export const getUTMParams = (): UTMParams => {
    if (typeof window === 'undefined') return {};

    try {
        const saved = localStorage.getItem(UTM_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};

/**
 * Get source label for display
 */
export const getSourceLabel = (): string => {
    const params = getUTMParams();

    if (params.utm_source) {
        return `${params.utm_source}${params.utm_campaign ? ` / ${params.utm_campaign}` : ''}`;
    }

    if (params.referrer && params.referrer !== 'direct') {
        try {
            const url = new URL(params.referrer);
            return url.hostname;
        } catch {
            return params.referrer;
        }
    }

    return 'Direct';
};

/**
 * Append UTM data to form submission
 */
export const appendUTMToFormData = (formData: Record<string, any>): Record<string, any> => {
    const utmParams = getUTMParams();

    return {
        ...formData,
        _utm: utmParams,
        _source: getSourceLabel(),
        _submitted_at: new Date().toISOString()
    };
};

// Auto-save UTM params on page load
if (typeof window !== 'undefined') {
    saveUTMParams();
}
