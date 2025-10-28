// Simple utility to create page URLs
export const createPageUrl = (pageName) => {
  if (pageName === 'Dashboard') return '/';
  return `/${pageName.toLowerCase()}`;
};