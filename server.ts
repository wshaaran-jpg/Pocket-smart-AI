import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// CORS Setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Gemini AI Client Setup
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Data Stores
interface UserAccount {
  username: string;
  email: string;
  password?: string;
  full_name: string;
}

interface UserSession {
  username: string;
  login_time: string;
  last_activity: string;
  user_data: Record<string, any>;
}

const users: Record<string, UserAccount> = {
  sai: {
    username: 'sai',
    email: 'sai@pocketsmart.ai',
    full_name: 'Sai Krishna',
    password: 'password123',
  },
  demo: {
    username: 'demo',
    email: 'demo@pocketsmart.ai',
    full_name: 'Demo User',
    password: 'password123',
  },
};

const activeSessions: Record<string, UserSession> = {
  sai: {
    username: 'sai',
    login_time: new Date(Date.now() - 3600000).toISOString(),
    last_activity: new Date().toISOString(),
    user_data: {
      last_home_budget: { budget: 5000, rooms: ['Living Room', 'Kitchen'] },
      last_party_budget: { budget: 5000, party_type: 'Wedding', guests: 3 },
      last_jewelry_budget: { budget: 5000, occasion: 'Birthday', has_image: true },
    },
  },
};

// Seed Recommendation History (matching screenshots on page 31 & 38)
const historyStore: Record<string, any[]> = {
  sai: [
    {
      id: 'hist-jwl-1',
      timestamp: 'May 22, 2025, 12:08 PM',
      type: 'jewelry',
      title: 'Jewelry Budget Plan',
      total_budget: 5000,
      remaining_budget: 800,
      currency: 'INR',
      input_summary: {
        occasion: 'Birthday',
        style: 'Casual & Minimalist',
        has_image: true,
      },
      result_summary: '3 items: Bracelet, Minimalist Ring, Classic Watch',
      full_result: {
        total_budget: 5000,
        allocated_budget: 4200,
        remaining_budget: 800,
        outfit_analysis: {
          colors: ['Blue', 'White'],
          style: 'Casual Chic',
          formality: 'Informal',
          key_notes: 'Button-down blue shirt with light accents. Metallic and leather accessories harmonize best.',
        },
        jewelry_recommendations: [
          {
            id: 'j1',
            item_type: 'Bracelet',
            name: 'Braided Leather & Steel Accent Bracelet',
            description: 'A simple braided leather bracelet with brushed metal accents. Complements the casual style without being overly flashy.',
            style: 'Casual',
            estimated_price: 500,
            search_terms: 'leather steel bracelet men casual',
            shopping_links: {
              Amazon: 'https://www.amazon.in/s?k=leather+steel+bracelet+men+casual',
              Flipkart: 'https://www.flipkart.com/search?q=leather+steel+bracelet+men+casual',
              BlueStone: 'https://www.bluestone.com/search.html?query=leather+bracelet',
              Tanishq: 'https://www.tanishq.co.in/search?q=casual+bracelet',
              CaratLane: 'https://www.caratlane.com/search?q=silver+bracelet',
              Melorra: 'https://www.melorra.com/search?q=bracelet',
              Meesho: 'https://www.meesho.com/search?q=mens+bracelet',
            },
          },
          {
            id: 'j2',
            item_type: 'Ring',
            name: 'Matte Grey Titanium Minimalist Band',
            description: 'A sleek silver or dark grey metal ring with a minimalist design. Clean silhouette matching cool blue tones.',
            style: 'Minimalist',
            estimated_price: 700,
            search_terms: 'matte titanium silver band ring minimalist',
            shopping_links: {
              Amazon: 'https://www.amazon.in/s?k=titanium+band+ring+minimalist',
              Flipkart: 'https://www.flipkart.com/search?q=titanium+band+ring+minimalist',
              BlueStone: 'https://www.bluestone.com/search.html?query=mens+band+ring',
              Tanishq: 'https://www.tanishq.co.in/search?q=plain+band+ring',
              CaratLane: 'https://www.caratlane.com/search?q=band+ring',
              Melorra: 'https://www.melorra.com/search?q=ring',
              Meesho: 'https://www.meesho.com/search?q=silver+ring',
            },
          },
          {
            id: 'j3',
            item_type: 'Watch',
            name: 'Classic Analog Watch with Dark Brown Leather Strap',
            description: 'A classic, simple watch with a leather or metal band. A darker band complements the shirt colors cleanly.',
            style: 'Classic',
            estimated_price: 3000,
            search_terms: 'classic analog watch leather strap blue dial',
            shopping_links: {
              Amazon: 'https://www.amazon.in/s?k=classic+analog+watch+leather+strap',
              Flipkart: 'https://www.flipkart.com/search?q=classic+analog+watch+leather+strap',
              BlueStone: 'https://www.bluestone.com/search.html?query=mens+watch',
              Tanishq: 'https://www.tanishq.co.in/search?q=titan+watch',
              CaratLane: 'https://www.caratlane.com/search?q=watch',
              Melorra: 'https://www.melorra.com/search?q=accessories',
              Meesho: 'https://www.meesho.com/search?q=leather+watch',
            },
          },
        ],
        styling_tips: [
          'Keep the jewelry minimal to match the casual style of the outfit.',
          'Consider the watch as a statement piece, choosing a design that reflects personal style.',
          'Ensure the metal tones of the ring and bracelet/watch buckle complement each other.',
          'Cool silver and gunmetal finish enhance the blue and white palette.',
        ],
      },
    },
    {
      id: 'hist-party-1',
      timestamp: 'May 22, 2025, 12:05 PM',
      type: 'party',
      title: 'Birthday Party Budget Plan',
      total_budget: 5000,
      remaining_budget: 0,
      currency: 'INR',
      input_summary: {
        party_type: 'Wedding / Intimate Reception',
        guests: 3,
        needs: ['Catering', 'Entertainment', 'Venue'],
      },
      result_summary: 'Full event package allocated across 4 categories',
      full_result: {
        total_budget: 5000,
        allocated_budget: 5000,
        remaining_budget: 0,
        budget_breakdown: [
          {
            category: 'Venue',
            allocation: 0,
            items: [
              {
                id: 'pv-1',
                name: 'Home / Living Hall Venue',
                description: 'Utilizing the home as the intimate party venue, saving huge booking fees for 3 guests.',
                estimated_price: 0,
                quantity: 1,
                search_terms: 'home party venue decorations setup',
                shopping_links: {
                  Google: 'https://www.google.com/search?q=home+party+setup',
                  MakeMyTrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=party+venue',
                  OYORooms: 'https://www.oyorooms.com/search?location=party+venue',
                  NoBroker: 'https://www.nobroker.in/property/search?searchTerm=party+hall',
                },
              },
            ],
          },
          {
            category: 'Catering',
            allocation: 2000,
            items: [
              {
                id: 'pc-1',
                name: 'Gourmet Meal & Appetizer Spread (3 pax)',
                description: 'Special curated meal or premium delivery for 3 people including appetizers and dessert.',
                estimated_price: 2000,
                quantity: 1,
                search_terms: 'party food combo family spread',
                shopping_links: {
                  Swiggy: 'https://www.swiggy.com/search?query=party+combo',
                  Zomato: 'https://www.zomato.com/search?q=gourmet+meal+box',
                  BigBasket: 'https://www.bigbasket.com/ps/?q=party+snacks',
                  Amazon: 'https://www.amazon.in/s?k=gourmet+chocolates+snacks',
                },
              },
            ],
          },
          {
            category: 'Entertainment',
            allocation: 2000,
            items: [
              {
                id: 'pe-1',
                name: 'Streaming Service Subscription / Movie Rental',
                description: 'One-month streaming pass or 4K movie rental on Netflix, Amazon Prime Video, or Hotstar.',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'streaming subscription ott voucher',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=ott+subscription+voucher',
                  Flipkart: 'https://www.flipkart.com/search?q=ott+voucher',
                  BookMyShow: 'https://in.bookmyshow.com/search?q=stream',
                },
              },
              {
                id: 'pe-2',
                name: 'Board Games / Card Games Set',
                description: 'Engaging board game or party card game for an entertaining evening.',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'board games party adult uno monopoly deal',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=board+games+party',
                  Flipkart: 'https://www.flipkart.com/search?q=board+games+party',
                  BookMyShow: 'https://in.bookmyshow.com/search?q=entertainment',
                },
              },
              {
                id: 'pe-3',
                name: 'Music Playlist & Ambient Speaker Access',
                description: 'Curated celebration playlist on Spotify or YouTube Music.',
                estimated_price: 0,
                quantity: 1,
                search_terms: 'bluetooth speaker portable celebration',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=bluetooth+speaker+party',
                  Flipkart: 'https://www.flipkart.com/search?q=bluetooth+speaker+party',
                },
              },
              {
                id: 'pe-4',
                name: 'Small Gift / Token for Guest of Honor',
                description: 'A thoughtful token of appreciation or celebratory keepsake.',
                estimated_price: 1000,
                quantity: 1,
                search_terms: 'anniversary wedding celebration gift box',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=celebration+gift+hamper',
                  Flipkart: 'https://www.flipkart.com/search?q=celebration+gift+hamper',
                  Myntra: 'https://www.myntra.com/search?q=gift+box',
                },
              },
            ],
          },
          {
            category: 'Contingency',
            allocation: 1000,
            items: [
              {
                id: 'pcon-1',
                name: 'Buffer for Unexpected Expenses',
                description: 'Safe margin for last minute dessert, ice, extra drinks or quick deliveries.',
                estimated_price: 1000,
                quantity: 1,
                search_terms: 'quick delivery beverages snacks',
                shopping_links: {
                  Swiggy: 'https://www.swiggy.com/search?query=instamart+ice+snacks',
                  BigBasket: 'https://www.bigbasket.com/ps/?q=cold+drinks',
                  Amazon: 'https://www.amazon.in/s?k=beverages+snacks',
                },
              },
            ],
          },
        ],
        calculation_table: [
          { category: 'Venue', items_count: 1, total_cost: 0, percentage_of_budget: 0 },
          { category: 'Catering', items_count: 1, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Entertainment', items_count: 4, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Contingency', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
        ],
        venue_suggestions: [
          {
            name: 'Cozy Living Space / Terrace Garden',
            type: 'Residential / Home',
            capacity: 5,
            estimated_cost: 0,
            location: 'Home Location',
            search_terms: 'terrace party fairy lights cushions',
            search_links: {
              Google: 'https://www.google.com/search?q=terrace+party+decor',
              OYORooms: 'https://www.oyorooms.com/search?location=budget+stay',
              MakeMyTrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=intimate+stay',
            },
          },
        ],
        additional_suggestions: [
          'Consider making the meal a potluck style if comfortable with guests to reduce catering costs.',
          'Look for discounts or bundle offers on streaming services or board games.',
          'Homemade decorations like fairy lights and fresh flowers can be a cost effective, charming alternative.',
          'Prepare a personalized music playlist in advance for smooth ambiance.',
        ],
      },
    },
    {
      id: 'hist-home-1',
      timestamp: 'May 22, 2025, 12:02 PM',
      type: 'home',
      title: 'Home Interior Budget Plan',
      total_budget: 5000,
      remaining_budget: 500,
      currency: 'INR',
      input_summary: {
        rooms: ['Living Room', 'Kitchen'],
        lights: 5,
        fans: 4,
        furniture: 2,
        dining_tables: 1,
      },
      result_summary: 'Lighting, Ceiling fans, and furniture budget allocation',
      full_result: {
        total_budget: 5000,
        allocated_budget: 4500,
        remaining_budget: 500,
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: 1500,
            items: [
              {
                id: 'hl-1',
                name: 'LED Bulb Pack (Warm White, 9W/12W)',
                description: 'Energy-efficient LED bulbs for warm, inviting ambient room lighting.',
                estimated_price: 500,
                quantity: 5,
                search_terms: 'philips led bulb 9w pack warm white',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=philips+led+bulb+warm+white',
                  Flipkart: 'https://www.flipkart.com/search?q=philips+led+bulb+warm+white',
                  IKEA: 'https://www.ikea.com/in/en/search/?q=led+bulb',
                  Myntra: 'https://www.myntra.com/search?q=lamp+lighting',
                  Ajio: 'https://www.ajio.com/search/?text=home+lighting',
                },
              },
              {
                id: 'hl-2',
                name: 'Minimalist Pendant Cord Light',
                description: 'Hanging single bulb minimalist cord fixture for dining or corner accent.',
                estimated_price: 1000,
                quantity: 1,
                search_terms: 'modern pendant hanging light fixture',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=modern+pendant+hanging+light',
                  Flipkart: 'https://www.flipkart.com/search?q=modern+pendant+hanging+light',
                  IKEA: 'https://www.ikea.com/in/en/search/?q=pendant+lamp',
                  Myntra: 'https://www.myntra.com/search?q=hanging+light',
                  Ajio: 'https://www.ajio.com/search/?text=pendant+lamp',
                },
              },
            ],
          },
          {
            category: 'Ceiling Fans',
            allocation: 2000,
            items: [
              {
                id: 'hf-1',
                name: 'Havells / Crompton High-Speed Ceiling Fan',
                description: 'Basic, functional ceiling fan with silent copper motor and reliable air delivery.',
                estimated_price: 2000,
                quantity: 1,
                search_terms: 'crompton havells high speed ceiling fan 1200mm',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=crompton+high+speed+ceiling+fan',
                  Flipkart: 'https://www.flipkart.com/search?q=crompton+high+speed+ceiling+fan',
                  IKEA: 'https://www.ikea.com/in/en/search/?q=fan',
                  Myntra: 'https://www.myntra.com/search?q=appliances',
                  Ajio: 'https://www.ajio.com/search/?text=ceiling+fan',
                },
              },
            ],
          },
          {
            category: 'Furniture',
            allocation: 1000,
            items: [
              {
                id: 'hfu-1',
                name: 'Stackable Matte Plastic Chairs (Set of 2)',
                description: 'Durable, modern stackable chairs suitable for kitchen or living accent seating.',
                estimated_price: 500,
                quantity: 2,
                search_terms: 'nilkamal modern dining plastic chairs',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=stackable+plastic+chairs+modern',
                  Flipkart: 'https://www.flipkart.com/search?q=stackable+plastic+chairs+modern',
                  IKEA: 'https://www.ikea.com/in/en/search/?q=dining+chair',
                  Myntra: 'https://www.myntra.com/search?q=chair',
                  Ajio: 'https://www.ajio.com/search/?text=furniture',
                },
              },
              {
                id: 'hfu-2',
                name: 'Compact Wooden Coffee / Side Table',
                description: 'Simple wooden table for living room side table or compact dining.',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'engineered wood coffee table side table',
                shopping_links: {
                  Amazon: 'https://www.amazon.in/s?k=wooden+coffee+side+table',
                  Flipkart: 'https://www.flipkart.com/search?q=wooden+coffee+side+table',
                  IKEA: 'https://www.ikea.com/in/en/search/?q=side+table',
                  Myntra: 'https://www.myntra.com/search?q=side+table',
                  Ajio: 'https://www.ajio.com/search/?text=table',
                },
              },
            ],
          },
        ],
        calculation_table: [
          { category: 'Lighting', items_count: 2, total_cost: 1500, percentage_of_budget: 30 },
          { category: 'Ceiling Fans', items_count: 1, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Furniture', items_count: 2, total_cost: 1000, percentage_of_budget: 20 },
        ],
        additional_suggestions: [
          'Consider purchasing gently used or factory-outlet furniture for further cost savings.',
          'Look for seasonal sales and festive discounts on online marketplaces (Amazon Great Indian Festival, Flipkart Big Billion Days).',
          'Prioritize essential lighting and fans first, and postpone non-essential accent items.',
          'Choose modular items that can be repurposed across bedrooms and living rooms.',
        ],
      },
    },
  ],
};

// Shopping Link Helpers
function buildShoppingLinks(category: string, query: string): Record<string, string> {
  const q = encodeURIComponent(query);
  const cat = category.toLowerCase();

  const links: Record<string, string> = {
    Amazon: `https://www.amazon.in/s?k=${q}`,
    Flipkart: `https://www.flipkart.com/search?q=${q}`,
  };

  if (cat.includes('light') || cat.includes('fan') || cat.includes('furn') || cat.includes('decor') || cat.includes('home') || cat.includes('table') || cat.includes('chair')) {
    links['IKEA'] = `https://www.ikea.com/in/en/search/?q=${q}`;
    links['Myntra'] = `https://www.myntra.com/search?q=${q}`;
    links['Ajio'] = `https://www.ajio.com/search/?text=${q}`;
  } else if (cat.includes('food') || cat.includes('cater') || cat.includes('drink') || cat.includes('snack') || cat.includes('party')) {
    links['Swiggy'] = `https://www.swiggy.com/search?query=${q}`;
    links['Zomato'] = `https://www.zomato.com/search?q=${q}`;
    links['BigBasket'] = `https://www.bigbasket.com/ps/?q=${q}`;
  } else if (cat.includes('venue') || cat.includes('hotel') || cat.includes('stay') || cat.includes('hall')) {
    links['MakeMyTrip'] = `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${q}`;
    links['OYORooms'] = `https://www.oyorooms.com/search?location=${q}`;
    links['Booking.com'] = `https://www.booking.com/search.html?ss=${q}`;
    links['NoBroker'] = `https://www.nobroker.in/property/search?searchTerm=${q}`;
  } else if (cat.includes('jewelry') || cat.includes('ring') || cat.includes('necklace') || cat.includes('bracelet') || cat.includes('earring') || cat.includes('watch')) {
    links['BlueStone'] = `https://www.bluestone.com/search.html?query=${q}`;
    links['Tanishq'] = `https://www.tanishq.co.in/search?q=${q}`;
    links['CaratLane'] = `https://www.caratlane.com/search?q=${q}`;
    links['Melorra'] = `https://www.melorra.com/search?q=${q}`;
    links['Meesho'] = `https://www.meesho.com/search?q=${q}`;
  }

  return links;
}

// Helper to extract JSON from Gemini text response
function extractJSON(text: string): any {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return JSON.parse(trimmed);
    }
    const match = trimmed.match(/```json\s*([\s\S]*?)\s*```/) || trimmed.match(/```\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
    }
  } catch (err) {
    console.error('Failed to parse JSON from AI response:', err);
  }
  return null;
}

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, full_name } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }
  if (users[username.toLowerCase()]) {
    return res.status(400).json({ error: 'Username already exists.' });
  }

  const newUser: UserAccount = {
    username: username.toLowerCase(),
    email,
    password: password || 'defaultpass',
    full_name: full_name || username,
  };
  users[username.toLowerCase()] = newUser;

  activeSessions[username.toLowerCase()] = {
    username: username.toLowerCase(),
    login_time: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    user_data: {},
  };

  if (!historyStore[username.toLowerCase()]) {
    historyStore[username.toLowerCase()] = [];
  }

  res.json({
    token: `token_${username.toLowerCase()}_${Date.now()}`,
    user: {
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  const u = username.toLowerCase();
  let user = users[u];
  if (!user) {
    // Auto-create or allow demo login for instant testing
    user = {
      username: u,
      email: `${u}@example.com`,
      full_name: u.charAt(0).toUpperCase() + u.slice(1),
      password: password || 'pass',
    };
    users[u] = user;
  }

  activeSessions[u] = {
    username: u,
    login_time: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    user_data: activeSessions[u]?.user_data || {},
  };

  if (!historyStore[u]) {
    historyStore[u] = [];
  }

  res.json({
    token: `token_${u}_${Date.now()}`,
    user: {
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    },
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const username = req.body.username?.toLowerCase() || 'sai';
  if (activeSessions[username]) {
    delete activeSessions[username];
  }
  res.json({ message: 'Successfully logged out.' });
});

app.get('/api/session-info', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let username = 'sai';
  if (authHeader && authHeader.includes('token_')) {
    const parts = authHeader.split('token_')[1]?.split('_');
    if (parts && parts[0]) username = parts[0];
  }
  const session = activeSessions[username] || {
    username,
    login_time: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    user_data: {},
  };

  res.json({
    username: session.username,
    login_time: session.login_time,
    last_activity: session.last_activity,
    session_duration_minutes: 45,
    user_data: session.user_data,
  });
});

app.post('/api/session-data', (req: Request, res: Response) => {
  const { username = 'sai', data } = req.body;
  const u = username.toLowerCase();
  if (activeSessions[u]) {
    activeSessions[u].user_data = { ...activeSessions[u].user_data, ...data };
    activeSessions[u].last_activity = new Date().toISOString();
  }
  res.json({ message: 'Session data updated.', data: activeSessions[u]?.user_data || {} });
});

// ----------------- HISTORY ROUTES -----------------
app.get('/api/history', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let username = 'sai';
  if (authHeader && authHeader.includes('token_')) {
    const parts = authHeader.split('token_')[1]?.split('_');
    if (parts && parts[0]) username = parts[0];
  }

  const userHistory = historyStore[username] || historyStore['sai'] || [];
  res.json({ history: userHistory });
});

app.get('/api/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  for (const u of Object.keys(historyStore)) {
    const found = historyStore[u].find((item) => item.id === id);
    if (found) return res.json(found);
  }
  res.status(404).json({ error: 'Recommendation not found' });
});

app.delete('/api/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  for (const u of Object.keys(historyStore)) {
    const idx = historyStore[u].findIndex((item) => item.id === id);
    if (idx !== -1) {
      historyStore[u].splice(idx, 1);
      return res.json({ message: 'History record deleted.' });
    }
  }
  res.status(404).json({ error: 'Item not found' });
});

// ----------------- GENERATE HOME BUDGET -----------------
app.post('/api/generate-home', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_lights = 5,
      num_fans = 4,
      num_furniture = 2,
      num_dining_tables = 1,
      rooms = { living_room: true, kitchen: true, bedroom: false },
      additional_requirements = '',
      currency = 'INR',
    } = req.body;

    const roomsList = Object.entries(rooms)
      .filter(([_, enabled]) => Boolean(enabled))
      .map(([name]) => name.replace('_', ' '))
      .join(', ');

    const prompt = `You are PocketSmart AI, an expert budget and home interior planner.
Generate a structured, realistic budget allocation and product recommendation plan for a home in India with a total budget of ₹${total_budget} (currency: ${currency}).
Requirements:
- Number of lights/fixtures: ${num_lights}
- Number of ceiling fans: ${num_fans}
- Number of furniture pieces: ${num_furniture}
- Number of dining tables: ${num_dining_tables}
- Rooms to consider: ${roomsList || 'Living Room, Kitchen'}
- Additional requirements: ${additional_requirements || 'None'}

Please provide realistic, cost-effective Indian product recommendations suitable for platforms like IKEA, Amazon, Flipkart, Myntra, and Ajio.
Ensure the total sum of allocated item costs does NOT exceed ${total_budget}. Leave a sensible remaining buffer or contingency.

You MUST respond strictly with valid JSON conforming to this schema (no markdown, just JSON):
{
  "total_budget": ${total_budget},
  "budget_breakdown": [
    {
      "category": "Lighting",
      "allocation": 1500,
      "items": [
        {
          "name": "LED Bulb Pack (Warm White)",
          "description": "Energy-efficient LED bulbs for warm room lighting.",
          "estimated_price": 500,
          "quantity": ${Math.max(1, num_lights)},
          "search_terms": "philips warm white led bulb pack"
        }
      ]
    },
    {
      "category": "Ceiling_fans",
      "allocation": 2000,
      "items": [
        {
          "name": "Havells / Crompton Ceiling Fan",
          "description": "Functional, reliable ceiling fan.",
          "estimated_price": 2000,
          "quantity": ${Math.max(1, num_fans)},
          "search_terms": "crompton high speed ceiling fan"
        }
      ]
    },
    {
      "category": "Furniture",
      "allocation": 1000,
      "items": [
        {
          "name": "Compact Table / Chairs",
          "description": "Durable seating or dining solution.",
          "estimated_price": 1000,
          "quantity": 1,
          "search_terms": "compact dining furniture set"
        }
      ]
    }
  ],
  "additional_suggestions": [
    "Consider purchasing used furniture for further cost savings.",
    "Look for sales and discounts on online marketplaces.",
    "Prioritize essential items and postpone non-essential purchases."
  ]
}`;

    let parsedResult: any = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          parsedResult = extractJSON(response.text);
        }
      } catch (geminiError) {
        console.warn('Gemini call error (falling back to smart generator):', geminiError);
      }
    }

    // Fallback if AI call didn't yield valid result
    if (!parsedResult || !parsedResult.budget_breakdown) {
      const b = Number(total_budget);
      const lightAlloc = Math.round(b * 0.3);
      const fanAlloc = Math.round(b * 0.4);
      const furnAlloc = Math.round(b * 0.2);
      const buffer = b - (lightAlloc + fanAlloc + furnAlloc);

      parsedResult = {
        total_budget: b,
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: lightAlloc,
            items: [
              {
                name: 'LED Bulbs & Fixtures Pack (Warm White)',
                description: `Pack of energy-efficient 9W LED bulbs tailored for ${roomsList || 'rooms'}.`,
                estimated_price: Math.max(250, Math.round(lightAlloc * 0.4)),
                quantity: Math.max(1, num_lights),
                search_terms: 'wipro philips 9w led bulb warm white pack',
              },
              {
                name: 'Pendant Hanging Ceiling Cord Lamp',
                description: 'Modern minimalist accent cord lamp suitable for dining corner or living room.',
                estimated_price: Math.max(300, Math.round(lightAlloc * 0.6)),
                quantity: 1,
                search_terms: 'minimalist hanging pendant light lamp',
              },
            ],
          },
          {
            category: 'Ceiling_fans',
            allocation: fanAlloc,
            items: [
              {
                name: 'Crompton / Havells High-Speed Ceiling Fan',
                description: 'Durable 1200mm high air delivery fan with copper motor and 2-year warranty.',
                estimated_price: fanAlloc,
                quantity: Math.max(1, num_fans),
                search_terms: 'crompton havells ceiling fan 1200mm',
              },
            ],
          },
          {
            category: 'Furniture & Dining',
            allocation: furnAlloc,
            items: [
              {
                name: 'Stackable Matte Finish Dining/Accent Chairs (Pair)',
                description: 'Modern molded ergonomic chairs easy to clean and store.',
                estimated_price: Math.round(furnAlloc * 0.5),
                quantity: Math.max(1, num_furniture),
                search_terms: 'modern stackable dining accent chairs set',
              },
              {
                name: 'Compact Wooden Coffee / Accent Table',
                description: 'Engineered wood clean finish table for dining or living room decor.',
                estimated_price: Math.round(furnAlloc * 0.5),
                quantity: Math.max(1, num_dining_tables),
                search_terms: 'compact engineered wood coffee dining table',
              },
            ],
          },
        ],
        additional_suggestions: [
          'Consider purchasing gently used or refurbished furniture for up to 40% cost savings.',
          'Take advantage of seasonal online sales (Amazon Great Indian Festival, Flipkart Big Billion Days) for bundled discounts.',
          'Prioritize high-efficiency 5-star BEE rated fans and LED bulbs to reduce monthly electricity costs.',
          'Start with core functional lighting and fans, and gradually add decorative ambient lamps as budget permits.',
        ],
      };
    }

    // Post-process with Shopping Links and Calculation Table
    let totalSpent = 0;
    const calculationTable: any[] = [];

    parsedResult.budget_breakdown = (parsedResult.budget_breakdown || []).map((cat: any, cIdx: number) => {
      let catTotal = 0;
      const items = (cat.items || []).map((item: any, iIdx: number) => {
        const cost = Number(item.estimated_price) || 0;
        catTotal += cost;
        totalSpent += cost;
        return {
          id: `h-item-${cIdx}-${iIdx}`,
          name: item.name,
          description: item.description,
          estimated_price: cost,
          quantity: item.quantity || 1,
          search_terms: item.search_terms || item.name,
          shopping_links: buildShoppingLinks(cat.category, item.search_terms || item.name),
        };
      });

      calculationTable.push({
        category: cat.category,
        items_count: items.length,
        total_cost: catTotal,
        percentage_of_budget: total_budget > 0 ? Math.round((catTotal / total_budget) * 100) : 0,
      });

      return {
        category: cat.category,
        allocation: cat.allocation || catTotal,
        items,
      };
    });

    const finalResult = {
      total_budget: Number(total_budget),
      allocated_budget: totalSpent,
      remaining_budget: Math.max(0, Number(total_budget) - totalSpent),
      budget_breakdown: parsedResult.budget_breakdown,
      calculation_table: calculationTable,
      additional_suggestions: parsedResult.additional_suggestions || [],
    };

    // Save to history
    const authHeader = req.headers.authorization;
    let username = 'sai';
    if (authHeader && authHeader.includes('token_')) {
      const parts = authHeader.split('token_')[1]?.split('_');
      if (parts && parts[0]) username = parts[0];
    }

    if (!historyStore[username]) historyStore[username] = [];
    historyStore[username].unshift({
      id: `hist-home-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: 'home',
      title: 'Home Interior Budget Plan',
      total_budget: Number(total_budget),
      remaining_budget: finalResult.remaining_budget,
      currency,
      input_summary: {
        rooms: roomsList,
        lights: num_lights,
        fans: num_fans,
        furniture: num_furniture,
        dining_tables: num_dining_tables,
      },
      result_summary: `${finalResult.budget_breakdown.length} Categories, ${finalResult.budget_breakdown.reduce((acc: number, c: any) => acc + c.items.length, 0)} Items`,
      full_result: finalResult,
    });

    res.json(finalResult);
  } catch (err: any) {
    console.error('Error in /generate-home:', err);
    res.status(500).json({ error: 'Error generating recommendations: ' + (err.message || String(err)) });
  }
});

// ----------------- GENERATE PARTY BUDGET -----------------
app.post('/api/generate-party', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_guests = 3,
      party_type = 'Wedding',
      venue_type = 'Home',
      needs_catering = true,
      needs_decoration = true,
      needs_entertainment = true,
      needs_photography = false,
      additional_requirements = '',
      currency = 'INR',
    } = req.body;

    const prompt = `You are PocketSmart AI, an expert event and party budget planner.
Generate a structured, detailed budget allocation for a party in India with a total budget of ₹${total_budget} (currency: ${currency}).
Party details:
- Event Type: ${party_type}
- Number of guests: ${num_guests}
- Venue Type: ${venue_type}
- Catering needed: ${needs_catering ? 'Yes' : 'No'}
- Decoration needed: ${needs_decoration ? 'Yes' : 'No'}
- Entertainment needed: ${needs_entertainment ? 'Yes' : 'No'}
- Photography needed: ${needs_photography ? 'Yes' : 'No'}
- Additional requirements: ${additional_requirements || 'None'}

Please provide a detailed budget breakdown with specific recommendations available in India using INR prices.
Use Indian brands, services, and typical cost expectations (Swiggy, Zomato, BigBasket, BookMyShow, MakeMyTrip, OYO, Amazon, Flipkart).
Ensure all costs are in INR and the total does not exceed ${total_budget}.

You MUST respond strictly with valid JSON conforming to this structure (no markdown, just JSON):
{
  "total_budget": ${total_budget},
  "budget_breakdown": [
    {
      "category": "Venue",
      "allocation": 0,
      "items": [
        {
          "name": "Home / Living Hall Venue",
          "description": "Utilizing home venue to optimize costs for intimate party.",
          "estimated_price": 0,
          "quantity": 1,
          "search_terms": "party venue"
        }
      ]
    },
    {
      "category": "Catering",
      "allocation": 2000,
      "items": [
        {
          "name": "Party Food Combo / Platter",
          "description": "Delicious appetizers and main meal for guests.",
          "estimated_price": 2000,
          "quantity": 1,
          "search_terms": "party platter meal combo"
        }
      ]
    },
    {
      "category": "Entertainment",
      "allocation": 2000,
      "items": [
        {
          "name": "Streaming & Music Setup",
          "description": "Entertainment subscription or party games.",
          "estimated_price": 1000,
          "quantity": 1,
          "search_terms": "party games streaming"
        },
        {
          "name": "Party Favors & Gift",
          "description": "Small thoughtful celebration favor.",
          "estimated_price": 1000,
          "quantity": 1,
          "search_terms": "celebration gift hamper"
        }
      ]
    },
    {
      "category": "Contingency",
      "allocation": 1000,
      "items": [
        {
          "name": "Unexpected Expenses Buffer",
          "description": "Safety margin for extra refreshments or last-minute needs.",
          "estimated_price": 1000,
          "quantity": 1,
          "search_terms": "beverages party snacks"
        }
      ]
    }
  ],
  "venue_suggestions": [
    {
      "name": "${venue_type === 'Home' ? 'Home Living & Terrace Area' : venue_type + ' Venue'}",
      "type": "${venue_type}",
      "capacity": ${Math.max(5, num_guests * 2)},
      "estimated_cost": ${venue_type === 'Home' ? 0 : Math.round(Number(total_budget) * 0.25)},
      "location": "Local City Area",
      "search_terms": "${venue_type.toLowerCase()} party venue rental"
    }
  ],
  "additional_suggestions": [
    "Consider making the meal a potluck style if comfortable with guests to reduce catering costs.",
    "Look for discounts or offers on streaming services or board games.",
    "Homemade decorations can be a cost effective alternative if you decide to add some."
  ]
}`;

    let parsedResult: any = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          parsedResult = extractJSON(response.text);
        }
      } catch (geminiError) {
        console.warn('Gemini party budget error (using fallback):', geminiError);
      }
    }

    if (!parsedResult || !parsedResult.budget_breakdown) {
      const b = Number(total_budget);
      const isHome = venue_type.toLowerCase().includes('home');
      const venueCost = isHome ? 0 : Math.round(b * 0.2);
      const remainingB = b - venueCost;
      const cateringCost = needs_catering ? Math.round(remainingB * 0.45) : 0;
      const decorCost = needs_decoration ? Math.round(remainingB * 0.2) : 0;
      const entCost = needs_entertainment ? Math.round(remainingB * 0.2) : 0;
      const contCost = b - (venueCost + cateringCost + decorCost + entCost);

      const breakdown: any[] = [];

      breakdown.push({
        category: 'Venue',
        allocation: venueCost,
        items: [
          {
            name: isHome ? 'Home Living & Garden Space' : `${venue_type} Celebration Spot`,
            description: isHome
              ? 'Utilizing your comfortable home space as the venue, keeping budget 100% focused on food and fun.'
              : `Curated ${venue_type} suitable for ${num_guests} guests.`,
            estimated_price: venueCost,
            quantity: 1,
            search_terms: isHome ? 'home party decor setup' : `${venue_type} party booking`,
          },
        ],
      });

      if (needs_catering) {
        breakdown.push({
          category: 'Catering',
          allocation: cateringCost,
          items: [
            {
              name: `Special Celebratory Meal & Starters (${num_guests} guests)`,
              description: `Generous menu with appetizers, signature main course, and celebratory dessert calculated for ${num_guests} people.`,
              estimated_price: cateringCost,
              quantity: 1,
              search_terms: 'party food catering box combo',
            },
          ],
        });
      }

      if (needs_decoration) {
        breakdown.push({
          category: 'Decoration',
          allocation: decorCost,
          items: [
            {
              name: 'Themed Balloon Arch & Banner Kit',
              description: `Complete DIY party kit with foil balloons, fairy warm string lights, and customizable backdrop for ${party_type}.`,
              estimated_price: decorCost,
              quantity: 1,
              search_terms: `${party_type.toLowerCase()} party decoration kit fairy lights balloons`,
            },
          ],
        });
      }

      if (needs_entertainment) {
        breakdown.push({
          category: 'Entertainment',
          allocation: entCost,
          items: [
            {
              name: 'Streaming Pass / Music & Interactive Games',
              description: 'Party card game set or streaming subscription rental for group amusement.',
              estimated_price: Math.round(entCost * 0.5),
              quantity: 1,
              search_terms: 'party board games music passes',
            },
            {
              name: 'Celebration Token / Guest Mementos',
              description: 'Thoughtful personalized return gift or celebratory token for guests.',
              estimated_price: entCost - Math.round(entCost * 0.5),
              quantity: 1,
              search_terms: 'party celebration gift favor hampers',
            },
          ],
        });
      }

      if (contCost > 0) {
        breakdown.push({
          category: 'Contingency',
          allocation: contCost,
          items: [
            {
              name: 'Emergency & Extra Refreshment Buffer',
              description: 'Buffer for unforeseen deliveries, ice, extra sodas, or last-minute essentials.',
              estimated_price: contCost,
              quantity: 1,
              search_terms: 'party beverages snacks quick delivery',
            },
          ],
        });
      }

      parsedResult = {
        total_budget: b,
        budget_breakdown: breakdown,
        venue_suggestions: [
          {
            name: isHome ? 'Home Living & Terrace' : `${venue_type} Choice`,
            type: venue_type,
            capacity: Math.max(5, num_guests * 2),
            estimated_cost: venueCost,
            location: 'City Area',
            search_terms: `${venue_type.toLowerCase()} event space`,
          },
        ],
        additional_suggestions: [
          'Pre-ordering party combos in bulk on food apps often unlocks 20-30% discount coupons.',
          'Use reusable party decor items or fairy lights that can be reused for upcoming festivals.',
          'Download your favorite celebration playlist offline to prevent streaming interruptions during the event.',
          'Keep a digital shared album link ready for guests to easily upload and share event photos.',
        ],
      };
    }

    // Attach search and shopping links
    let totalSpent = 0;
    const calculationTable: any[] = [];

    parsedResult.budget_breakdown = (parsedResult.budget_breakdown || []).map((cat: any, cIdx: number) => {
      let catTotal = 0;
      const items = (cat.items || []).map((item: any, iIdx: number) => {
        const cost = Number(item.estimated_price) || 0;
        catTotal += cost;
        totalSpent += cost;
        return {
          id: `p-item-${cIdx}-${iIdx}`,
          name: item.name,
          description: item.description,
          estimated_price: cost,
          quantity: item.quantity || 1,
          search_terms: item.search_terms || item.name,
          shopping_links: buildShoppingLinks(cat.category, item.search_terms || item.name),
        };
      });

      calculationTable.push({
        category: cat.category,
        items_count: items.length,
        total_cost: catTotal,
        percentage_of_budget: total_budget > 0 ? Math.round((catTotal / total_budget) * 100) : 0,
      });

      return {
        category: cat.category,
        allocation: cat.allocation || catTotal,
        items,
      };
    });

    // Enhance venue suggestions with direct links
    const venueSuggestions = (parsedResult.venue_suggestions || []).map((v: any) => ({
      ...v,
      search_links: {
        Google: `https://www.google.com/search?q=${encodeURIComponent(v.search_terms || v.name)}`,
        MakeMyTrip: `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${encodeURIComponent(v.search_terms || v.name)}`,
        OYORooms: `https://www.oyorooms.com/search?location=${encodeURIComponent(v.search_terms || v.name)}`,
        NoBroker: `https://www.nobroker.in/property/search?searchTerm=${encodeURIComponent(v.search_terms || v.name)}`,
      },
    }));

    const finalResult = {
      total_budget: Number(total_budget),
      allocated_budget: totalSpent,
      remaining_budget: Math.max(0, Number(total_budget) - totalSpent),
      budget_breakdown: parsedResult.budget_breakdown,
      calculation_table: calculationTable,
      venue_suggestions: venueSuggestions,
      additional_suggestions: parsedResult.additional_suggestions || [],
    };

    // Save history
    const authHeader = req.headers.authorization;
    let username = 'sai';
    if (authHeader && authHeader.includes('token_')) {
      const parts = authHeader.split('token_')[1]?.split('_');
      if (parts && parts[0]) username = parts[0];
    }
    if (!historyStore[username]) historyStore[username] = [];
    historyStore[username].unshift({
      id: `hist-party-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: 'party',
      title: `${party_type} Budget Plan`,
      total_budget: Number(total_budget),
      remaining_budget: finalResult.remaining_budget,
      currency,
      input_summary: {
        party_type,
        guests: num_guests,
        venue_type,
        needs: [
          needs_catering ? 'Catering' : null,
          needs_decoration ? 'Decoration' : null,
          needs_entertainment ? 'Entertainment' : null,
        ].filter(Boolean),
      },
      result_summary: `${num_guests} Guests, ${finalResult.budget_breakdown.length} Categories planned`,
      full_result: finalResult,
    });

    res.json(finalResult);
  } catch (err: any) {
    console.error('Error in /generate-party:', err);
    res.status(500).json({ error: 'Error generating recommendations: ' + (err.message || String(err)) });
  }
});

// ----------------- GENERATE JEWELRY BUDGET (MULTIMODAL) -----------------
app.post('/api/generate-jewelry', async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      occasion = 'Birthday',
      preferences = 'Casual & Minimalist',
      image_base64 = null,
      currency = 'INR',
    } = req.body;

    const basePrompt = `You are PocketSmart AI, an expert jewelry stylist and personal shopping assistant.
A user wants jewelry recommendations for India within a total budget of ₹${total_budget} (currency: ${currency}).
Occasion: ${occasion}
Preferences: ${preferences || 'Not specified'}
Provide jewelry recommendations tailored to this occasion and budget. Suggest items like bracelets, rings, necklaces, earrings, or watches.
Make sure prices are in INR and the total stay within budget.
Provide Indian-friendly search terms suitable for Indian shopping platforms (Tanishq, CaratLane, BlueStone, Melorra, Amazon, Flipkart, Meesho).

Format your output strictly as JSON with this structure (no markdown, just JSON):
{
  "outfit_analysis": {
    "colors": ["Blue", "White"],
    "style": "Casual Chic",
    "formality": "Informal",
    "key_notes": "Clean aesthetic matching subtle metallic and leather accents."
  },
  "total_budget": ${total_budget},
  "jewelry_recommendations": [
    {
      "item_type": "Bracelet",
      "name": "Braided Leather & Steel Accent Bracelet",
      "description": "A simple, braided leather bracelet with metal accents. This complements the casual style of the outfit without being overly flashy.",
      "style": "Casual",
      "estimated_price": 500,
      "search_terms": "leather steel bracelet casual"
    },
    {
      "item_type": "Ring",
      "name": "Minimalist Matte Silver Band",
      "description": "A silver or dark grey metal ring with a minimalist design. Clean and non-ostentatious.",
      "style": "Minimalist",
      "estimated_price": 700,
      "search_terms": "minimalist silver band ring"
    },
    {
      "item_type": "Watch",
      "name": "Classic Analog Watch with Leather Strap",
      "description": "A classic, simple watch with a leather or metal band. A darker band would complement the shirt's colors.",
      "style": "Classic",
      "estimated_price": 3000,
      "search_terms": "classic leather strap analog watch"
    }
  ],
  "remaining_budget": 800,
  "styling_tips": [
    "Keep the jewelry minimal to match the casual style of the outfit.",
    "Consider the watch as a statement piece, choosing a design that reflects personal style.",
    "Ensure the metal tones of the ring and bracelet (if metal accents are chosen) complement each other."
  ]
}`;

    let parsedResult: any = null;

    if (ai) {
      try {
        let contentsPayload: any = basePrompt;

        if (image_base64 && typeof image_base64 === 'string') {
          // Extract mime and pure base64
          let mimeType = 'image/jpeg';
          let pureData = image_base64;
          if (image_base64.startsWith('data:')) {
            const matches = image_base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (matches) {
              mimeType = matches[1];
              pureData = matches[2];
            }
          }

          const imagePart = {
            inlineData: {
              mimeType,
              data: pureData,
            },
          };
          const textPart = {
            text: `An image of the user's outfit is provided. Carefully analyze the outfit colors, pattern, neckline, formality, and design in the image.
Suggest jewelry pieces that complement the outfit aesthetically, considering color coordination, metal tones, and occasion appropriateness for ${occasion} within ₹${total_budget}.
${basePrompt}`,
          };
          contentsPayload = { parts: [imagePart, textPart] };
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsPayload,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response && response.text) {
          parsedResult = extractJSON(response.text);
        }
      } catch (geminiError) {
        console.warn('Gemini jewelry error (using fallback):', geminiError);
      }
    }

    if (!parsedResult || !parsedResult.jewelry_recommendations) {
      const b = Number(total_budget);
      const isWedding = occasion.toLowerCase().includes('wedding');
      const isTraditional = preferences.toLowerCase().includes('traditional') || isWedding;

      if (isTraditional) {
        parsedResult = {
          total_budget: b,
          outfit_analysis: {
            colors: ['Gold', 'Maroon', 'Emerald'],
            style: 'Traditional Festive / Royal',
            formality: 'Formal Celebration',
            key_notes: 'Rich fabric and ornate design best paired with antique gold, kundan, or pearl accents.',
          },
          jewelry_recommendations: [
            {
              item_type: 'Necklace',
              name: 'Kundan & Pearl Choker Set',
              description: 'Exquisite traditional choker necklace set with matching drop earrings and intricate pearl hangings.',
              style: 'Traditional Indian',
              estimated_price: Math.round(b * 0.45),
              search_terms: 'kundan pearl choker necklace traditional',
            },
            {
              item_type: 'Bangles / Kada',
              name: 'Antique Gold-Plated Openable Kada Pair',
              description: 'Floral embossed antique polish bangles that complement silk and festive sarees/lehengas.',
              style: 'Antique Gold',
              estimated_price: Math.round(b * 0.25),
              search_terms: 'antique gold plated temple kada bangles',
            },
            {
              item_type: 'Ring',
              name: 'Statement Polki Cocktail Ring',
              description: 'Adjustable statement ring featuring uncut polki stone work and enamel floral edging.',
              style: 'Statement',
              estimated_price: Math.round(b * 0.15),
              search_terms: 'polki cocktail statement ring traditional',
            },
          ],
          remaining_budget: Math.max(0, Math.round(b * 0.15)),
          styling_tips: [
            'Let the neckline guide your necklace: high necklines pair wonderfully with long rani haars, whereas sweetheart or broad necklines shine with a choker.',
            'Maintain consistency in metal tone—stick with warm antique gold polish across necklace, kada, and rings.',
            'Balance the statement jewelry by choosing a neat updo hairstyle to accentuate earrings and neckline.',
          ],
        };
      } else {
        // Modern / Casual (matching screenshot on page 37)
        parsedResult = {
          total_budget: b,
          outfit_analysis: {
            colors: ['Blue', 'White'],
            style: 'Casual & Minimalist',
            formality: 'Informal',
            key_notes: 'Button-down blue shirt with light accents. Metallic and leather accessories harmonize best.',
          },
          jewelry_recommendations: [
            {
              item_type: 'Bracelet',
              name: 'Braided Leather & Brushed Steel Accent Bracelet',
              description: 'A simple, braided leather bracelet with brushed metal accents. This complements the casual style of the outfit without being overly flashy.',
              style: 'Casual',
              estimated_price: Math.min(500, Math.round(b * 0.15)),
              search_terms: 'mens leather steel braided bracelet casual',
            },
            {
              item_type: 'Ring',
              name: 'Minimalist Matte Gunmetal / Silver Band',
              description: 'A silver or dark grey metal ring with a minimalist design. Avoid anything too large or ostentatious to maintain the casual feel.',
              style: 'Minimalist',
              estimated_price: Math.min(700, Math.round(b * 0.2)),
              search_terms: 'minimalist matte titanium ring band',
            },
            {
              item_type: 'Watch',
              name: 'Classic Analog Watch with Dark Brown Leather Strap',
              description: 'A classic, simple watch with a leather or metal band. A darker band will cleanly complement the shirt colors.',
              style: 'Classic',
              estimated_price: Math.min(3000, Math.round(b * 0.55)),
              search_terms: 'classic analog watch leather strap blue dial',
            },
          ],
          remaining_budget: Math.max(0, b - (500 + 700 + 3000)),
          styling_tips: [
            'Keep the jewelry minimal to match the casual style of the outfit.',
            'Consider the watch as a statement piece, choosing a design that reflects personal style.',
            'Ensure the metal tones of the ring and bracelet (if metal accents are chosen) complement each other.',
            'Matte and brushed finishes elevate everyday wear without appearing pretentious.',
          ],
        };
      }
    }

    // Attach jewelry platform shopping links
    let totalSpent = 0;
    const items = (parsedResult.jewelry_recommendations || []).map((item: any, idx: number) => {
      const cost = Number(item.estimated_price) || 0;
      totalSpent += cost;
      return {
        id: `jwl-item-${idx}`,
        item_type: item.item_type || 'Jewelry',
        name: item.name,
        description: item.description,
        style: item.style || 'Modern',
        estimated_price: cost,
        search_terms: item.search_terms || item.name,
        shopping_links: buildShoppingLinks('jewelry', item.search_terms || item.name),
      };
    });

    const finalResult = {
      total_budget: Number(total_budget),
      allocated_budget: totalSpent,
      remaining_budget: Math.max(0, Number(total_budget) - totalSpent),
      outfit_analysis: parsedResult.outfit_analysis || null,
      jewelry_recommendations: items,
      styling_tips: parsedResult.styling_tips || [],
    };

    // Save history
    const authHeader = req.headers.authorization;
    let username = 'sai';
    if (authHeader && authHeader.includes('token_')) {
      const parts = authHeader.split('token_')[1]?.split('_');
      if (parts && parts[0]) username = parts[0];
    }
    if (!historyStore[username]) historyStore[username] = [];
    historyStore[username].unshift({
      id: `hist-jwl-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: 'jewelry',
      title: 'Jewelry Budget Plan',
      total_budget: Number(total_budget),
      remaining_budget: finalResult.remaining_budget,
      currency,
      input_summary: {
        occasion,
        style: preferences,
        has_image: Boolean(image_base64),
      },
      result_summary: `${items.length} pieces recommended for ${occasion}`,
      full_result: finalResult,
    });

    res.json(finalResult);
  } catch (err: any) {
    console.error('Error in /generate-jewelry:', err);
    res.status(500).json({ error: 'Error generating recommendations: ' + (err.message || String(err)) });
  }
});

// Vite Integration: Serve frontend in dev via Vite middlewares, or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PocketSmart AI server running on port ${PORT}`);
  });
}

startServer();
