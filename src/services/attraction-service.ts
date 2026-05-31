import { Attraction, Coordinates } from '../types';

// Curated high-fidelity attractions for top world cities
const curatedAttractions: Record<string, Omit<Attraction, 'id'>[]> = {
  paris: [
    {
      name: 'Eiffel Tower',
      rating: 4.8,
      category: 'Architecture',
      description: 'The iconic 19th-century iron tower on the Champ de Mars, offering breathtaking panoramic views of Paris.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8584, lng: 2.2945 },
      reviewsCount: 14250,
      avgDuration: '2 hours',
      priceRange: '$$',
    },
    {
      name: 'Louvre Museum',
      rating: 4.7,
      category: 'Art',
      description: 'The world\'s largest art museum and a historic monument in Paris, home to the Mona Lisa and Venus de Milo.',
      image: 'https://images.unsplash.com/photo-1499856138823-ef88d8b248a0?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8606, lng: 2.3376 },
      reviewsCount: 18420,
      avgDuration: '3-4 hours',
      priceRange: '$$',
    },
    {
      name: 'Notre-Dame Cathedral',
      rating: 4.8,
      category: 'History',
      description: 'The legendary medieval Catholic cathedral, renowned for its French Gothic architecture, gargoyles, and stained glass.',
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8530, lng: 2.3499 },
      reviewsCount: 9680,
      avgDuration: '1 hour',
      priceRange: 'Free',
    },
    {
      name: 'Basilique du Sacré-Cœur',
      rating: 4.7,
      category: 'Architecture',
      description: 'An iconic white-domed basilica sitting atop Montmartre, offering Paris\'s highest natural overlook.',
      image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8867, lng: 2.3431 },
      reviewsCount: 7850,
      avgDuration: '1.5 hours',
      priceRange: 'Free',
    },
    {
      name: 'Jardin du Luxembourg',
      rating: 4.8,
      category: 'Nature',
      description: 'Stunning 17th-century palace gardens featuring quiet tree-lined promenades, fountains, and classic green metal chairs.',
      image: 'https://images.unsplash.com/photo-1549842603-9d41445bf7a4?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8462, lng: 2.3371 },
      reviewsCount: 4230,
      avgDuration: '2 hours',
      priceRange: 'Free',
    },
    {
      name: 'Le Comptoir du Relais',
      rating: 4.6,
      category: 'Culinary',
      description: 'A legendary bistro in Saint-Germain-des-Prés offering high-concept gourmet classic French plates.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 48.8521, lng: 2.3392 },
      reviewsCount: 1850,
      avgDuration: '1.5 hours',
      priceRange: '$$$',
    }
  ],
  tokyo: [
    {
      name: 'Senso-ji Temple',
      rating: 4.8,
      category: 'History',
      description: 'Tokyo\'s oldest and one of its most significant Buddhist temples, located in the heart of historic Asakusa.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 35.7148, lng: 139.7967 },
      reviewsCount: 12400,
      avgDuration: '1.5 hours',
      priceRange: 'Free',
    },
    {
      name: 'Shibuya Crossing',
      rating: 4.6,
      category: 'Leisure',
      description: 'The world\'s busiest pedestrian intersection, surrounded by massive glowing neon screens and vibrant urban life.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 35.6595, lng: 139.7004 },
      reviewsCount: 22800,
      avgDuration: '1 hour',
      priceRange: 'Free',
    },
    {
      name: 'Meiji Jingu Shrine',
      rating: 4.7,
      category: 'Nature',
      description: 'A serene Shinto shrine set within a vast, dense forest of 120,000 trees in the middle of buzzing Shibuya.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 35.6764, lng: 139.6993 },
      reviewsCount: 8900,
      avgDuration: '2 hours',
      priceRange: 'Free',
    },
    {
      name: 'Shinjuku Gyoen National Garden',
      rating: 4.8,
      category: 'Nature',
      description: 'A beautiful expansive garden combining traditional Japanese, English landscape, and French formal garden styling.',
      image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 35.6852, lng: 139.7101 },
      reviewsCount: 6540,
      avgDuration: '2 hours',
      priceRange: '$',
    },
    {
      name: 'Tokyo Skytree',
      rating: 4.7,
      category: 'Architecture',
      description: 'The tallest structure in Japan, offering an incredible, futuristic 360-degree observation deck high above the megalopolis.',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 35.7101, lng: 139.8107 },
      reviewsCount: 15400,
      avgDuration: '2 hours',
      priceRange: '$$$',
    }
  ],
  newyork: [
    {
      name: 'Central Park',
      rating: 4.8,
      category: 'Nature',
      description: 'The historic, sprawling 843-acre urban park in the middle of Manhattan, complete with lakes, walking paths, and bridges.',
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 40.7851, lng: -73.9682 },
      reviewsCount: 25400,
      avgDuration: '2-3 hours',
      priceRange: 'Free',
    },
    {
      name: 'Empire State Building',
      rating: 4.7,
      category: 'Architecture',
      description: 'The legendary Art Deco skyscraper in Midtown Manhattan, known globally for its iconic silhouette and viewing decks.',
      image: 'https://images.unsplash.com/photo-1522083165195-342750297f05?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 40.7484, lng: -73.9857 },
      reviewsCount: 19800,
      avgDuration: '2 hours',
      priceRange: '$$$',
    },
    {
      name: 'The Metropolitan Museum of Art',
      rating: 4.9,
      category: 'Art',
      description: 'One of the world\'s greatest art institutions, spanning 5,000 years of global history across two million square feet.',
      image: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 40.7794, lng: -73.9632 },
      reviewsCount: 16500,
      avgDuration: '3 hours',
      priceRange: '$$',
    },
    {
      name: 'Statue of Liberty',
      rating: 4.8,
      category: 'History',
      description: 'France\'s historic colossal gift of freedom standing tall on Liberty Island in New York Harbor.',
      image: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 40.6892, lng: -74.0445 },
      reviewsCount: 18700,
      avgDuration: '3 hours',
      priceRange: '$$',
    },
    {
      name: 'The High Line',
      rating: 4.7,
      category: 'Leisure',
      description: 'A beautifully elevated, public park built on a historic, abandoned freight rail line along Manhattan\'s West Side.',
      image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 40.7480, lng: -74.0048 },
      reviewsCount: 9400,
      avgDuration: '1.5 hours',
      priceRange: 'Free',
    }
  ],
  london: [
    {
      name: 'British Museum',
      rating: 4.8,
      category: 'History',
      description: 'A world-class dedicated chronicle of human history, art, and culture housing the Rosetta Stone and Elgin Marbles.',
      image: 'https://images.unsplash.com/photo-1582299839446-ad53ec220d91?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 51.5194, lng: -0.1270 },
      reviewsCount: 14200,
      avgDuration: '3 hours',
      priceRange: 'Free',
    },
    {
      name: 'Big Ben & Houses of Parliament',
      rating: 4.7,
      category: 'Architecture',
      description: 'The monumental Gothic architectural icon of London standing proud beside the River Thames.',
      image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 51.5007, lng: -0.1246 },
      reviewsCount: 22400,
      avgDuration: '1 hour',
      priceRange: 'Free',
    },
    {
      name: 'London Eye',
      rating: 4.5,
      category: 'Leisure',
      description: 'The giant cantilevered observation wheel on the South Bank of the River Thames, offering monumental aerial views.',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 51.5033, lng: -0.1195 },
      reviewsCount: 18500,
      avgDuration: '1 hour',
      priceRange: '$$$',
    },
    {
      name: 'Tower of London',
      rating: 4.8,
      category: 'History',
      description: 'Her Majesty\'s 1,000-year-old historic castle and fortress, home to the dazzling Crown Jewels.',
      image: 'https://images.unsplash.com/photo-1512470827298-94860df56920?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 51.5081, lng: -0.0759 },
      reviewsCount: 16700,
      avgDuration: '2.5 hours',
      priceRange: '$$',
    }
  ],
  rome: [
    {
      name: 'Colosseum',
      rating: 4.9,
      category: 'History',
      description: 'The historic oval amphitheatre in the center of Rome, the largest ancient amphitheatre ever constructed.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 41.8902, lng: 12.4922 },
      reviewsCount: 28400,
      avgDuration: '2.5 hours',
      priceRange: '$$',
    },
    {
      name: 'The Pantheon',
      rating: 4.8,
      category: 'Architecture',
      description: 'A monumentally preserved former Roman temple, featuring the world\'s largest unreinforced concrete dome.',
      image: 'https://images.unsplash.com/photo-1542820229-081e0c12af0b?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 41.8986, lng: 12.4769 },
      reviewsCount: 14200,
      avgDuration: '1 hour',
      priceRange: 'Free',
    },
    {
      name: 'Trevi Fountain',
      rating: 4.7,
      category: 'Art',
      description: 'The grand Baroque masterwork fountain where travelers toss coins to secure a legendary return to Rome.',
      image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=800&q=80',
      coordinates: { lat: 41.9009, lng: 12.4833 },
      reviewsCount: 24500,
      avgDuration: '1 hour',
      priceRange: 'Free',
    }
  ]
};

// High-quality category images for dynamic, geocoded fallback generation
const categoryFallbackImages: Record<Attraction['category'], string> = {
  History: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
  Nature: 'https://images.unsplash.com/photo-1472214222541-d510753a49fa?auto=format&fit=crop&w=800&q=80',
  Art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
  Culinary: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  Architecture: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  Shopping: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  Leisure: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
};

const dynamicAttractionTemplates: {
  name: string;
  category: Attraction['category'];
  description: string;
  latOffset: number;
  lngOffset: number;
  avgDuration: string;
  priceRange: Attraction['priceRange'];
}[] = [
  {
    name: 'Historic Old Quarter',
    category: 'History',
    description: 'Explore the atmospheric old town pathways, historical architecture, and rich local history legacy of this city.',
    latOffset: 0.003,
    lngOffset: -0.004,
    avgDuration: '2 hours',
    priceRange: 'Free',
  },
  {
    name: 'City Botanical Garden & Park',
    category: 'Nature',
    description: 'A beautiful local green escape featuring local flora, scenic quiet walkways, and serene relaxation lawns.',
    latOffset: -0.005,
    lngOffset: 0.006,
    avgDuration: '2 hours',
    priceRange: 'Free',
  },
  {
    name: 'Fine Arts & Craft Museum',
    category: 'Art',
    description: 'Exhibitions showcasing beautiful local arts, contemporary sculptures, and regional heritage displays.',
    latOffset: 0.008,
    lngOffset: 0.002,
    avgDuration: '2.5 hours',
    priceRange: '$$',
  },
  {
    name: 'Central Culinary Market',
    category: 'Culinary',
    description: 'A popular buzzing food district to experience traditional street snacks, fresh local products, and artisan treats.',
    latOffset: -0.002,
    lngOffset: -0.005,
    avgDuration: '1.5 hours',
    priceRange: '$',
  },
  {
    name: 'Panoramic Skyline Overlook',
    category: 'Architecture',
    description: 'An elevated observation platform providing an awesome bird\'s eye view of the city\'s landmark silhouettes.',
    latOffset: 0.006,
    lngOffset: 0.007,
    avgDuration: '1 hour',
    priceRange: '$$',
  },
  {
    name: 'Artisan Boutique Promenade',
    category: 'Shopping',
    description: 'A beautiful leafy boulevard featuring local independent labels, handicraft shops, and outdoor espresso spots.',
    latOffset: -0.004,
    lngOffset: 0.003,
    avgDuration: '2 hours',
    priceRange: '$$',
  },
  {
    name: 'Central Plaza & Waterway Walk',
    category: 'Leisure',
    description: 'A vibrant public plaza and pedestrian boardwalk ideal for evening strolls, quiet reading, and people-watching.',
    latOffset: 0.001,
    lngOffset: -0.001,
    avgDuration: '1.5 hours',
    priceRange: 'Free',
  }
];

export const getAttractionsForCity = (cityName: string, coords: Coordinates): Attraction[] => {
  // Normalize city name
  const normalizedKey = cityName.toLowerCase().replace(/[^a-z]/g, '');

  if (curatedAttractions[normalizedKey]) {
    return curatedAttractions[normalizedKey].map((attr, idx) => ({
      ...attr,
      id: `${normalizedKey}-${idx}`,
    }));
  }

  // Fallback: Generate custom geocoded attractions centered around geocoded city coordinates
  return dynamicAttractionTemplates.map((tpl, idx) => {
    const lat = coords.lat + tpl.latOffset;
    const lng = coords.lng + tpl.lngOffset;
    const cleanCityName = cityName.split(',')[0];
    
    return {
      id: `generated-${idx}-${lat.toFixed(4)}`,
      name: `${cleanCityName} ${tpl.name}`,
      rating: parseFloat((4.4 + Math.random() * 0.5).toFixed(1)),
      category: tpl.category,
      description: tpl.description.replace('this city', cleanCityName),
      image: categoryFallbackImages[tpl.category],
      coordinates: { lat, lng },
      reviewsCount: Math.floor(250 + Math.random() * 4500),
      avgDuration: tpl.avgDuration,
      priceRange: tpl.priceRange,
    };
  });
};
