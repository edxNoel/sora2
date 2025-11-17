// Simple local storage authentication for testing

const STORAGE_KEY = 'videohook_users'

export const authUtils = {
  // Get all users from localStorage
  getUsers() {
    try {
      const users = localStorage.getItem(STORAGE_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Error reading users:', error)
      return []
    }
  },

  // Save users to localStorage
  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving users:', error)
    }
  },

  // Sign up a new user
  signup(username, password) {
    const users = this.getUsers()
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' }
    }

    // Add new user
    const newUser = {
      username,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    this.saveUsers(users)
    
    return { success: true, user: { username } }
  },

  // Login user
  login(username, password) {
    const users = this.getUsers()
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      // Save current user session
      localStorage.setItem('videohook_current_user', JSON.stringify({ username }))
      return { success: true, user: { username } }
    }
    
    return { success: false, error: 'Invalid username or password' }
  },

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('videohook_current_user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      return null
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('videohook_current_user')
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null
  }
}


