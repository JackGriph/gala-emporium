// user-roles.js - Module for handling user roles and permissions

// Get the current user's role (stored in localStorage for simplicity)
export function getUserRole() {
  return localStorage.getItem('userRole') || 'user'; // Default to 'user' if not logged in
}

// Set the user's role
export function setUserRole(role) {
  localStorage.setItem('userRole', role);
}

// Check if user is logged in
export function isLoggedIn() {
  return getUserRole() !== null;
}

// Simulate authentication - check if email is admin
export function authenticateUser(email, password) {
  // Simple simulation: hardcoded admin emails
  const adminEmails = ['admin@gala.se', 'clubadmin@gala.se'];
  
  if (adminEmails.includes(email.toLowerCase()) && password === 'admin123') {
    setUserRole('club-admin');
    return { success: true, role: 'club-admin' };
  } else if (email && password) {
    // Any other valid login is a regular user
    setUserRole('user');
    return { success: true, role: 'user' };
  }
  
  return { success: false, message: 'Ogiltiga inloggningsuppgifter' };
}

// Logout user
export function logoutUser() {
  localStorage.removeItem('userRole');
}

// Check if user is an admin (Club-Admin)
export function isAdmin(userRole = getUserRole()) {
  return userRole === 'club-admin';
}