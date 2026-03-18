import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gardigital.menu',
  appName: 'SoloMenu',
  webDir: 'public',
  server: {
    url: 'https://www.solomenu.it/login',
    cleartext: true,
    allowNavigation: [
      'www.solomenu.it',
      'solomenu.it'
    ]
  }
};

export default config;
