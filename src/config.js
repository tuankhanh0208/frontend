// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// PayOS Configuration
export const PAYOS_CONFIG = {
    clientId: '8beadbae-a0e7-4923-b5e9-f49fcadd3ca4',
    apiKey: '760cfb21-3d78-428e-b556-3a41060d8a42',
    callbackUrl: 'http://localhost:3000/payment/payos/callback',
    apiUrl: 'https://api-sandbox.payos.vn/v2/payment-requests',
    useSandbox: true,
    listsBankUrl: process.env.REACT_APP_LISTS_BANK_URL || 'https://api.vietqr.io/v2/banks',
    scriptUrl: process.env.REACT_APP_PAYOS_SCRIPT || 'https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js'
};

// Company Information
export const COMPANY_INFO = {
    name: 'SM Food Store',
    slogan: 'Nâng tầm ẩm thực Việt',
    founded: 2024,
    address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
    phone: '+84 123 456 789',
    email: 'contact@smfoodstore.com',
    socialMedia: {
        facebook: 'https://facebook.com/smfoodstore',
        instagram: 'https://instagram.com/smfoodstore',
        twitter: 'https://twitter.com/smfoodstore'
    }
};

// Other Configuration
export const APP_CONFIG = {
    name: COMPANY_INFO.name,
    currency: 'VND',
    currencySymbol: '₫',
    defaultLanguage: 'vi',
    supportedLanguages: ['vi', 'en']
};