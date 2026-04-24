import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sakeenah.adhkar',
  appName: 'Sakeenah',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;
