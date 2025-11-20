// Default data for games and packages
// This will be used as fallback when localStorage is empty

export const defaultGames = [
  {
    id: 1,
    name: 'Free Fire',
    image: '/assets/cards/freefire.jpg',
    status: 'active',
    description: 'Top up your Free Fire diamonds instantly',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'PUBG Mobile',
    image: '/assets/cards/pubg.jpg',
    status: 'active',
    description: 'Get UC for PUBG Mobile',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Mobile Legends',
    image: '/assets/cards/mlbb.jpg',
    status: 'active',
    description: 'Buy Mobile Legends diamonds',
    createdAt: new Date().toISOString()
  }
]

export const defaultPackages = [
  // Free Fire Packages - Diamonds
  {
    id: 1,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '100 Diamonds',
    price: 'LKR 150',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '310 Diamonds',
    price: 'LKR 450',
    status: 'active',
    popular: true,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '520 Diamonds',
    price: 'LKR 750',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '1060 Diamonds',
    price: 'LKR 1500',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 13,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '2180 Diamonds',
    price: 'LKR 3000',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 14,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '5600 Diamonds',
    price: 'LKR 7500',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  // Free Fire Membership Packages
  {
    id: 15,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Weekly Lite Membership',
    price: 'LKR 120',
    status: 'active',
    popular: false,
    image: '/assets/cards/1.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 16,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Weekly Membership',
    price: 'LKR 470',
    status: 'active',
    popular: true,
    image: '/assets/cards/2.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 17,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Monthly Membership',
    price: 'LKR 2350',
    status: 'active',
    popular: false,
    image: '/assets/cards/3.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 18,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Little Pack',
    price: 'LKR 1180',
    status: 'active',
    popular: false,
    image: '/assets/cards/4.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 19,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'VIP Pack',
    price: 'LKR 2800',
    status: 'active',
    popular: false,
    image: '/assets/cards/5.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 20,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'VIP Special',
    price: 'LKR 2920',
    status: 'active',
    popular: false,
    image: '/assets/cards/6.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 21,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Big Pack',
    price: 'LKR 4200',
    status: 'active',
    popular: false,
    image: '/assets/cards/7.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 22,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Super VIP',
    price: 'LKR 5620',
    status: 'active',
    popular: false,
    image: '/assets/cards/8.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 23,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '3000 Diamonds',
    price: 'LKR 7050',
    status: 'active',
    popular: false,
    image: '/assets/cards/9.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 24,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '5000 Diamonds',
    price: 'LKR 11750',
    status: 'active',
    popular: false,
    image: '/assets/cards/10.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 25,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '8000 Diamonds',
    price: 'LKR 18850',
    status: 'active',
    popular: false,
    image: '/assets/cards/11.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 26,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '10000 Diamonds',
    price: 'LKR 23500',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 27,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Evo Access 3D',
    price: 'LKR 190',
    status: 'active',
    popular: false,
    image: '/assets/cards/12.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 28,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Evo Access 7D',
    price: 'LKR 290',
    status: 'active',
    popular: false,
    image: '/assets/cards/12.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 29,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Evo Access 30D',
    price: 'LKR 790',
    status: 'active',
    popular: false,
    image: '/assets/cards/12.png',
    createdAt: new Date().toISOString()
  },
  {
    id: 30,
    gameId: 1,
    gameName: 'Free Fire',
    amount: 'Level Up Pass',
    price: 'LKR 1300',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 31,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '25 Diamonds',
    price: 'LKR 75',
    status: 'active',
    popular: false,
    image: '/assets/cards/freefire.jpg',
    createdAt: new Date().toISOString()
  },
  // PUBG Mobile Packages
  {
    id: 5,
    gameId: 2,
    gameName: 'PUBG Mobile',
    amount: '60 UC',
    price: 'LKR 100',
    status: 'active',
    image: '/assets/cards/pubg.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    gameId: 2,
    gameName: 'PUBG Mobile',
    amount: '325 UC',
    price: 'LKR 500',
    status: 'active',
    image: '/assets/cards/pubg.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    gameId: 2,
    gameName: 'PUBG Mobile',
    amount: '660 UC',
    price: 'LKR 1000',
    status: 'active',
    image: '/assets/cards/pubg.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    gameId: 2,
    gameName: 'PUBG Mobile',
    amount: '1800 UC',
    price: 'LKR 2500',
    status: 'active',
    image: '/assets/cards/pubg.jpg',
    createdAt: new Date().toISOString()
  },
  // Mobile Legends Packages
  {
    id: 9,
    gameId: 3,
    gameName: 'Mobile Legends',
    amount: '86 Diamonds',
    price: 'LKR 200',
    status: 'active',
    image: '/assets/cards/mlbb.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    gameId: 3,
    gameName: 'Mobile Legends',
    amount: '172 Diamonds',
    price: 'LKR 400',
    status: 'active',
    image: '/assets/cards/mlbb.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    gameId: 3,
    gameName: 'Mobile Legends',
    amount: '344 Diamonds',
    price: 'LKR 800',
    status: 'active',
    image: '/assets/cards/mlbb.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    gameId: 3,
    gameName: 'Mobile Legends',
    amount: '706 Diamonds',
    price: 'LKR 1600',
    status: 'active',
    image: '/assets/cards/mlbb.jpg',
    createdAt: new Date().toISOString()
  }
]
