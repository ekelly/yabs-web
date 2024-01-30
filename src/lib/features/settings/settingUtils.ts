"use client";
export enum SettingKey {
  venmoUsername = "venmoUsername",
}

export const updateVenmoUsername = (username?: string | null) => {
  if (username) {
    localStorage.setItem(SettingKey.venmoUsername, username);
  } else {
    localStorage.removeItem(SettingKey.venmoUsername);
  }
};

export const getSetting = (key: SettingKey) => {
  return localStorage.getItem(key);
};
