// Geolocation Service - Detecta localização do usuário via IP e GPS
export async function getUserLocation() {
    try {
        console.log('🌍 Detectando sua localização...');

        // Tentar primeira API: ip-api.com (sem bloqueio de requests)
        try {
            const res1 = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,city,lat,lon,timezone,query');
            const data1 = await res1.json();

            if (data1.status === 'success' && data1.city) {
                console.log('✅ Localização detectada via ip-api:', data1.city, data1.region);
                return {
                    ip: data1.query,
                    city: data1.city,
                    region: data1.region,
                    country: data1.country,
                    countryCode: data1.countryCode,
                    latitude: data1.lat,
                    longitude: data1.lon,
                    timezone: data1.timezone,
                };
            }
        } catch (e) {
            console.warn('⚠️ ip-api falhou, tentando próxima...', e);
        }

        // Tentar segunda API: ipapi.co
        try {
            const res2 = await fetch('https://ipapi.co/json/');
            if (res2.ok) {
                const data2 = await res2.json();
                if (data2.city) {
                    console.log('✅ Localização detectada via ipapi.co:', data2.city, data2.region);
                    return {
                        ip: data2.ip,
                        city: data2.city,
                        region: data2.region || '',
                        country: data2.country_name || 'Brasil',
                        countryCode: data2.country_code || 'BR',
                        latitude: data2.latitude,
                        longitude: data2.longitude,
                        timezone: data2.timezone,
                    };
                }
            }
        } catch (e) {
            console.warn('⚠️ ipapi.co falhou, tentando GPS...', e);
        }

        // Se APIs de IP falharam, tentar GPS do navegador
        console.log('📍 Tentando GPS do navegador...');
        const gpsLocation = await getLocationFromNavigator();
        if (gpsLocation) {
            return gpsLocation;
        }

        throw new Error('Nenhuma API funcionou');

    } catch (error) {
        console.error('❌ Erro ao obter localização:', error);

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

// Usar GPS do navegador (mais preciso, mas pede permissão)
async function getLocationFromNavigator(): Promise<any> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    console.log('📍 GPS obtido:', latitude, longitude);

                    // Fazer reverse geocoding para obter cidade
                    const city = await reverseGeocode(latitude, longitude);

                    resolve({
                        ip: 'gps',
                        city: city || 'sua cidade',
                        region: '',
                        country: 'Brasil',
                        countryCode: 'BR',
                        latitude,
                        longitude,
                        timezone: 'America/Sao_Paulo',
                    });
                } catch (error) {
                    resolve(null);
                }
            },
            () => {
                console.log('❌ Permissão de GPS negada');
                resolve(null);
            },
            { timeout: 5000 }
        );
    });
}

// Reverse geocoding - converter coordenadas em cidade
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
        // Usar Nominatim (OpenStreetMap) - gratuito
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt-BR`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality;
        console.log('🏙️ Cidade via GPS:', city);
        return city;
    } catch (error) {
        return null;
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
