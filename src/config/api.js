// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  API_URL: `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`,
  WIDGET_URL: `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/widget`,
  IS_PRODUCTION: process.env.REACT_APP_ENVIRONMENT === 'production'
};

export default API_CONFIG;