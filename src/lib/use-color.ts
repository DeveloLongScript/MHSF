import { useAtom, atom } from "jotai";

export function useColor() {
  return useAtom(atom("zinc"));
}
