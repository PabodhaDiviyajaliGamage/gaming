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
  // Free Fire Packages
  {
    id: 1,
    gameId: 1,
    gameName: 'Free Fire',
    amount: '100 Diamonds',
    price: 'LKR 150',
    status: 'active',
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
