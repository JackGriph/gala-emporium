// user-roles.js - Module for handling user roles and permissions

// Get the current user's role (stored in localStorage for simplicity)
export function getUserRole() {
  return localStorage.getItem('userRole') || null; // Default to null if not logged in
}

// Set the user's role
export function setUserRole(role) {
  localStorage.setItem('userRole', role);
}

// Simulate authentication - check if email is admin
export function authenticateUser(email, password) {
  // Simple simulation: hardcoded admin emails
  const adminEmails = ['admin@gala.se', 'clubadmin@gala.se'];
  
  if (adminEmails.includes(email.toLowerCase()) && password === 'admin123') {
    setUserRole('club-admin');
    return { success: true, role: 'club-admin' };
  }
  
  return { success: false, message: 'Ogiltiga inloggningsuppgifter' };
}

// Logout user
export function logoutUser() {
  localStorage.removeItem('userRole');
}

// Check if user is an admin
export function isAdmin(userRole = getUserRole()) {
  return userRole === 'club-admin';
}