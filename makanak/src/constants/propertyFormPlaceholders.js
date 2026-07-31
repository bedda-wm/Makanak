/**
 * Replace with API-backed lists when ready.
 */

export const PLACEHOLDER_CITIES = [
  'Cairo',
  'Giza',
  'Alexandria',
]

/** city -> districts */
export const PLACEHOLDER_DISTRICTS_BY_CITY = {
  Cairo: [
    '15 May City',
    '1st Settlement',
    '1st Zone',
    '3rd Settlement',
    '5th Settlement',
    '6th Settlement',
    'Ain Shams',
    'Al Daraisa',
    'Al Fostat',
    'Al Manial',
    'Badr City',
    'Gesr Al Suez',
    'Hadayek al-Kobba',
    'Heliopolis',
    'Helmeyat El Zaytoun',
    'Helwan',
    'Katameya',
    'Maadi',
    'Madinaty',
    'Mokattam',
    'Mostakbal City',
    'Nasr City',
    'New Cairo',
    'New Capital City',
    'New Heliopolis',
    'New Nozha',
    'Obour City',
    'R3',
    'R7',
    'R8',
    'Sheraton',
    'Shorouk City',
    'Tersa',
    'Waboor Elmayah',
    'Zahraa Al Maadi',
  ],
  Giza: [
    '6th of October',
    'Agouza',
    'Cairo Alexandria Desert Road',
    'Dokki',
    'Faisal',
    'Giza District',
    'Hadayek October',
    'Hadayek al-Ahram',
    'Haram',
    'Mohandessin',
    'Palm Hills',
    'Sheikh Zayed',
  ],
  Alexandria: [
    'Abu Qir',
    'Agami',
    'Al Ibrahimiyyah',
    'Amreya',
    'Asafra',
    'Attarin',
    'Azarita',
    'Bahray - Anfoshy',
    'Bolkly',
    'Borg al-Arab',
    'Camp Caesar',
    'Cleopatra',
    'Dekheila',
    'Fleming',
    'Gianaclis',
    'Glim',
    'Gomrok',
    'Hay Gharb',
    'Kafr Abdo',
    'King Mariout',
    'Laurent',
    'Maamoura',
    'Mandara',
    'Manshiyya',
    'Miami',
    'Moharam Bik',
    'Montazah',
    'Nakheel',
    'Raml Station',
    'Roushdy',
    'Saba Pasha',
    'San Stefano',
    'Schutz',
    'Seyouf',
    'Shatby',
    'Sidi Beshr',
    'Sidi Gaber',
    'Smoha',
    'Sporting',
    'Stanley',
    'Victoria',
    'Zizinia',
  ],
}

export const DEFAULT_CITY = PLACEHOLDER_CITIES[0]

export function getDistrictsForCity(city) {
  return PLACEHOLDER_DISTRICTS_BY_CITY[city] ?? []
}

/** id, label, description — swap icons later */
export const PLACEHOLDER_AMENITIES = [
  {
    id: 'parking',
    label: 'Parking',
    description: 'Dedicated parking space',
  },
  {
    id: 'pool',
    label: 'Swimming pool',
    description: 'Pool on premises',
  },
  {
    id: 'elevator',
    label: 'Elevator',
    description: 'Lift access',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Additional features',
  },
]
