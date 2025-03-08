/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

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
    set: async (
      key: string,
      value: string | boolean,
      userEntry: boolean,
      __unsafeMetadata = false
    ) => {
      if (isSignedIn && userEntry === true && __unsafeMetadata) {
        await user.update({ unsafeMetadata: { [key]: value } });
      }
      if (isSignedIn && userEntry === true) {
        await fetch("/api/v0/account-sl/change", {
          body: JSON.stringify({ [key]: value }),
          method: "POST",
        });
      }
      if (!isSignedIn && userEntry) localStorage.setItem(key, value.toString());
      if (userEntry === false) {
        localStorage.setItem(key, value.toString());
      }
    },
  };
}
