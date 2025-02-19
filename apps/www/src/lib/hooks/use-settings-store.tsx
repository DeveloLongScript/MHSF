import { useUser } from "@clerk/nextjs";

export function useSettingsStore() {
  const { isSignedIn, user } = useUser();

  /* Get: (key: string) =>
        check if the user is signed in, if so, check user storage & grab entry
        if not or if the entry couldn't be found, check browser storage
       Set: (key: string, value: string, userEntry: boolean) =>
        if user signed in & userEntry === true, send to user storage
        if user signed out & userEntry === true, do nothing
        if userEntry === false, send to browser
    */

  return {
    get: (key: string) => {
      if (isSignedIn) {
        const value = user.publicMetadata[key] as string | boolean;

        if (value === undefined) return localStorage.getItem(key);
        return value;
      }
      return localStorage.getItem(key);
    },
    set: async (key: string, value: string, userEntry: boolean) => {
      if (isSignedIn && userEntry === true) {
        await fetch("/api/v0/account-sl/change", {
          body: JSON.stringify({ [key]: value }),
        });
      }
      if (!isSignedIn && userEntry)
        throw new Error("How is this even possible?!?!");
      if (userEntry === false) {
        localStorage.setItem(key, value);
      }
    },
  };
}
