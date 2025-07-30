export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specs: {
    material: string;
    color: string;
    dimensions: string;
    weight: string;
    care?: string;
    assembly?: string;
  };
  images: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  features?: string[];
  contactInfo?: {
    phone: string;
    email: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "modernsofa",
    category: "sofas",
    price: 1299,
    image: "/img/cardimg.png",
    description: "zamonaviydivan",
    specs: {
      material: "Solid wood frame, high-density foam cushions, linen upholstery",
      color: "Neutral tones",
      dimensions: "84\"W x 36\"D x 32\"H",
      weight: "45 kg",
      care: "Spot clean with mild detergent",
      assembly: "Minimal assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 127,
    features: [
      "Plush comfort cushions",
      "Durable construction",
      "Neutral color options",
      "Easy maintenance"
    ],
    contactInfo: {
      phone: "(555) 123-4567",
      email: "sales@cozyhome.com"
    }
  },
  {
    id: 2,
    name: "sectionalsofa",
    category: "sofas",
    price: 1899,
    image: "/img/cardimg.png",
    description: "seksionaldivan",
    specs: {
      material: "Premium fabric, solid hardwood frame, high-density foam",
      color: "Charcoal gray",
      dimensions: "120\"W x 85\"D x 35\"H",
      weight: "85 kg",
      care: "Professional cleaning recommended",
      assembly: "Professional assembly included"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    features: [
      "Generous seating capacity",
      "Premium materials",
      "Timeless design",
      "Professional assembly"
    ]
  },
  {
    id: 3,
    name: "coffeetable",
    category: "coffeeTables",
    price: 399,
    image: "/img/cardimg.png",
    description: "kofestoli",
    specs: {
      material: "Solid oak wood, tempered glass",
      color: "Natural oak",
      dimensions: "48\"W x 24\"D x 18\"H",
      weight: "25 kg",
      care: "Wipe with damp cloth",
      assembly: "Simple assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 156,
    features: [
      "Clean minimalist design",
      "Ample storage space",
      "Solid oak construction",
      "Easy assembly"
    ]
  },
  {
    id: 4,
    name: "endtable",
    category: "endTables",
    price: 199,
    image: "/img/cardimg.png",
    description: "chekkastol",
    specs: {
      material: "Cherry wood, brass hardware",
      color: "Cherry finish",
      dimensions: "20\"W x 20\"D x 26\"H",
      weight: "12 kg",
      care: "Polish with wood cleaner",
      assembly: "No assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.5,
    reviews: 78,
    features: [
      "Classic elegant design",
      "Cherry wood construction",
      "Brass hardware accents",
      "Ready to use"
    ]
  },
  {
    id: 5,
    name: "tvstand",
    category: "tvStands",
    price: 599,
    image: "/img/cardimg.png",
    description: "tvstend",
    specs: {
      material: "Engineered wood, metal legs",
      color: "Walnut finish",
      dimensions: "60\"W x 18\"D x 24\"H",
      weight: "35 kg",
      care: "Dust regularly",
      assembly: "Assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.4,
    reviews: 92,
    features: [
      "Contemporary design",
      "Cable management",
      "Ample storage",
      "Easy assembly"
    ]
  },
  {
    id: 6,
    name: "armchair",
    category: "armchairs",
    price: 499,
    image: "/img/cardimg.png",
    description: "kreslo",
    specs: {
      material: "Velvet fabric, solid wood frame",
      color: "Navy blue",
      dimensions: "32\"W x 35\"D x 38\"H",
      weight: "28 kg",
      care: "Spot clean only",
      assembly: "No assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 203,
    features: [
      "Plush velvet fabric",
      "Supportive design",
      "Perfect for reading",
      "Ready to use"
    ]
  },
  {
    id: 7,
    name: "classicsofa",
    category: "sofas",
    price: 1499,
    image: "/img/cardimg.png",
    description: "klassikdivan",
    specs: {
      material: "Performance fabric, steel frame",
      color: "Light gray",
      dimensions: "Variable (modular)",
      weight: "75 kg",
      care: "Machine washable covers",
      assembly: "Modular assembly"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 134,
    features: [
      "Modular design",
      "Configurable layout",
      "Performance fabric",
      "Easy to clean"
    ]
  },
  {
    id: 8,
    name: "lshapedsofa",
    category: "sofas",
    price: 2099,
    image: "/img/cardimg.png",
    description: "lshaklidagidivan",
    specs: {
      material: "Premium leather, solid wood frame",
      color: "Cognac brown",
      dimensions: "140\"W x 95\"D x 38\"H",
      weight: "120 kg",
      care: "Leather conditioner recommended",
      assembly: "Professional assembly"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 167,
    features: [
      "Premium leather upholstery",
      "L-shaped configuration",
      "Maximum seating",
      "Professional assembly"
    ]
  },
  {
    id: 9,
    name: "coffeetable",
    category: "coffeeTables",
    price: 449,
    image: "/img/cardimg.png",
    description: "kofestoli",
    specs: {
      material: "Marble top, gold-finished metal base",
      color: "White marble, gold finish",
      dimensions: "36\"D x 18\"H",
      weight: "30 kg",
      care: "Marble cleaner recommended",
      assembly: "Simple assembly"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.6,
    reviews: 98,
    features: [
      "Marble top",
      "Gold-finished base",
      "Elegant design",
      "Easy assembly"
    ]
  },
  {
    id: 10,
    name: "endtable",
    category: "endTables",
    price: 229,
    image: "/img/cardimg.png",
    description: "chekkastol",
    specs: {
      material: "MDF, laminate finish",
      color: "White",
      dimensions: "16\"W x 16\"D x 24\"H",
      weight: "8 kg",
      care: "Wipe with damp cloth",
      assembly: "No assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.3,
    reviews: 67,
    features: [
      "Compact design",
      "Versatile use",
      "Easy to clean",
      "Ready to use"
    ]
  },
  {
    id: 11,
    name: "tvstand",
    category: "tvStands",
    price: 649,
    image: "/img/cardimg.png",
    description: "tvstend",
    specs: {
      material: "Engineered wood, metal brackets",
      color: "Black",
      dimensions: "70\"W x 15\"D x 4\"H",
      weight: "20 kg",
      care: "Dust regularly",
      assembly: "Wall mounting required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.5,
    reviews: 73,
    features: [
      "Wall-mounted design",
      "Modern floating look",
      "Cable management",
      "Professional installation"
    ]
  },
  {
    id: 12,
    name: "reclinersofa",
    category: "armchairs",
    price: 549,
    image: "/img/cardimg.png",
    description: "orqagasuyanadigandivan",
    specs: {
      material: "Microfiber fabric, metal reclining mechanism",
      color: "Dark gray",
      dimensions: "35\"W x 38\"D x 40\"H",
      weight: "45 kg",
      care: "Spot clean with mild detergent",
      assembly: "Assembly required"
    },
    images: [
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png",
      "/img/cardimg.png"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 145,
    features: [
      "Smooth reclining mechanism",
      "Plush cushioning",
      "Durable construction",
      "Easy assembly"
    ]
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
}; 