function getAccessToken(): string | null {
    return localStorage.getItem("ACCESS_TOKEN");
}

const BASE_URL = '/api';

function createHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// Custom fetch function with built-in error handling
async function customFetch(url: string, options: RequestInit = {}): Promise<any> {
    const fullUrl = `${BASE_URL}/${url}`;

    // Set up request with headers
    const requestOptions: RequestInit = {
        ...options,
        headers: {
            ...createHeaders(),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(fullUrl, requestOptions);

        // Handle unauthorized responses
        if (response.status === 403) {
            const UNAUTHORIZED_PATHS = ['/signin', '/signup'];
            if (!UNAUTHORIZED_PATHS.includes(window.location.pathname)) {
                localStorage.removeItem('ACCESS_TOKEN');
                window.location.href = '/signin';
                throw new Error('Unauthorized access');
            }
        }

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check content type to determine parsing method
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

// Create HTTP method wrappers
const fetchClient = {
    get: (url: string, options: RequestInit = {}) =>
        customFetch(url, { ...options, method: 'GET' }),

    post: (url: string, data: any, options: RequestInit = {}) =>
        customFetch(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        }),

    put: (url: string, data: any, options: RequestInit = {}) =>
        customFetch(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (url: string, options: RequestInit = {}) =>
        customFetch(url, { ...options, method: 'DELETE' }),

    patch: (url: string, data: any, options: RequestInit = {}) =>
        customFetch(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

export default fetchClient;