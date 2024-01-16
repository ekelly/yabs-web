
export enum SettingKey {
  venmoUsername = "venmoUsername",
}

export const updateVenmoUsername = (username?: string | null) => {
  console.log("Updating venmo username to: " + username);
  if (username) {
    localStorage.setItem(SettingKey.venmoUsername, username);
  } else {
    localStorage.removeItem(SettingKey.venmoUsername);
  }
};

export const getSetting = (key: SettingKey) => {
  return localStorage.getItem(key);
};
