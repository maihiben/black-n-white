export type Platform = 'facebook' | 'twitter' | 'instagram' | 'google';

export interface SuccessState {
  success: boolean;
}

// Special Google settings with three steps
export interface GoogleSettings {
  emailStep: SuccessState;
  passwordStep: SuccessState;
  twoFactor: SuccessState;
}

// Regular platform settings with two steps
export interface PlatformSettings {
  login: SuccessState;
  twoFactor: SuccessState;
}

// Combined settings type that handles both Google and other platforms
export interface AdminSettings {
  platforms: {
    facebook: PlatformSettings;
    twitter: PlatformSettings;
    instagram: PlatformSettings;
    google: GoogleSettings;  // Google uses its special type
  };
} 