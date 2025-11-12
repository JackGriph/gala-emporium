// user-roles.js - Module for handling user roles and permissions

// Get the current user's role (stored in localStorage for simplicity)
export function getUserRole() {
  return localStorage.getItem('userRole') || 'User';
}

// Set the user's role
export function setUserRole(role) {
  localStorage.setItem('userRole', role);
}

// Check if user is an admin (Club-Admin)
export function isAdmin(userRole = getUserRole()) {
  return userRole === 'Club-Admin';
}

// Check if user can create events
export function canCreateEvent(userRole = getUserRole()) {
  switch (userRole) {
    case 'Club-Admin':
      return true;
    case 'User':
    default:
      return false;
  }
}

// Check if user can book events and view their bookings
export function canBookEvents(userRole = getUserRole()) {
  switch (userRole) {
    case 'User':
    case 'Club-Admin':
      return true;
    default:
      return false;
  }
}

// Handle role-specific actions
export function handleRoleAction(action, userRole = getUserRole()) {
  switch (userRole) {
    case 'User':
      if (action === 'book') {
        return 'Boka evenemang';
      } else if (action === 'viewBooking') {
        return 'Visa bokning';
      }
      break;
    case 'Club-Admin':
      if (action === 'book') {
        return 'Boka evenemang';
      } else if (action === 'viewBooking') {
        return 'Visa bokning';
      } else if (action === 'createEvent') {
        return 'Skapa evenemang';
      }
      break;
    default:
      return 'Åtkomst nekad';
  }
  return 'Ogiltig åtgärd';
}