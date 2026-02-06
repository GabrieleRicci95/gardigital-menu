import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gardigital.menu',
  appName: 'Gardigital Menu',
  webDir: 'public',
  server: {
    url: 'https://www.gardigital.it/login',
    cleartext: true,
    allowNavigation: [
      'www.gardigital.it',
      'gardigital.it'
    ]
  }
};

export default config;
