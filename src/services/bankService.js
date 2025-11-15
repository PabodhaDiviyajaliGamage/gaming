// Mock bank service for retrieving bank account information

const bankService = {
  /**
   * Get all bank accounts from API
   * @returns {Promise<Array>} Array of bank account objects
   */
  getAllBanks: async () => {
    try {
      // In production, this would call your API
      // For now, return empty array to use hardcoded data
      return []
    } catch (error) {
      console.error('Error fetching banks:', error)
      return []
    }
  },

  /**
   * Fallback to localStorage if API fails
   * @returns {Array} Bank accounts from localStorage
   */
  fallbackToLocalStorage: () => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return []
    }
    
    try {
      const banks = localStorage.getItem('bankAccounts')
      return banks ? JSON.parse(banks) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  },

  /**
   * Save banks to localStorage
   * @param {Array} banks - Array of bank accounts
   */
  saveBanksToLocalStorage: (banks) => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      localStorage.setItem('bankAccounts', JSON.stringify(banks))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
}

export default bankService
