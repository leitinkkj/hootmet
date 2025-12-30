// Geolocation Service - Detecta localização do usuário via IP
export async function getUserLocation() {
    try {
        // Usando ipapi.co - API gratuita de geolocalização por IP
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error('Failed to fetch location');
        }

        const data = await response.json();

        return {
            ip: data.ip,
            city: data.city || 'sua cidade',
            region: data.region || '',
            country: data.country_name || 'Brasil',
            countryCode: data.country_code || 'BR',
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
        };
    } catch (error) {
        console.error('Error getting user location:', error);

        // Fallback para dados genéricos
        return {
            ip: 'unknown',
            city: 'sua cidade',
            region: '',
            country: 'Brasil',
            countryCode: 'BR',
            latitude: null,
            longitude: null,
            timezone: 'America/Sao_Paulo',
        };
    }
}

// Calcular distância entre duas coordenadas (em km)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Formatar distância de forma amigável
export function formatDistance(km: number): string {
    if (km < 1) {
        return 'Bem pertinho';
    } else if (km < 5) {
        return `${km} km`;
    } else if (km < 50) {
        return `${km} km de distância`;
    } else {
        return `${km} km`;
    }
}

// Salvar localização no localStorage
export function saveUserLocation(location: any) {
    try {
        localStorage.setItem('userLocation', JSON.stringify(location));
        localStorage.setItem('locationTimestamp', Date.now().toString());
    } catch (error) {
        console.error('Error saving location:', error);
    }
}

// Recuperar localização do localStorage
export function getSavedLocation() {
    try {
        const saved = localStorage.getItem('userLocation');
        const timestamp = localStorage.getItem('locationTimestamp');

        if (!saved || !timestamp) {
            return null;
        }

        // Cache de 24 horas
        const age = Date.now() - parseInt(timestamp);
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas em ms

        if (age > MAX_AGE) {
            return null;
        }

        return JSON.parse(saved);
    } catch (error) {
        console.error('Error getting saved location:', error);
        return null;
    }
}
