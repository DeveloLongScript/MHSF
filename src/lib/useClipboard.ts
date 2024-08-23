import toast from "react-hot-toast"

/** A hook to properly write text to the clipboard without triggering a client-side error
 * @version 1.0
 */
export default function useClipboard() {

    const writeText = (text: string) => {
        if (navigator.clipboard == undefined)
            return toast.error("Clipboard doesn't exist");

        navigator.clipboard.writeText(text);
    }
    const write = (text: ClipboardItems) => {
        if (navigator.clipboard == undefined)
            return toast.error("Clipboard doesn't exist")

        navigator.clipboard.write(text);
    }
    return { writeText, write };
}