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

"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { generateID } from "@/lib/form-helper";
import { Input } from "@/components/ui/input";
import { FilePlusIcon } from "lucide-react";

interface FileInputProps {
  accept?: string;
  files?: FileList | null;
  label?: string;
  id?: string;
  url?: string;
}

const ImageInput = ({
  accept = "image/*",
  files: initialFiles = null,
  label,
  id = generateID(),
  url,
}: FileInputProps) => {
  const [files, setFiles] = useState<FileList | null>(initialFiles);
  const [dragover, setDragover] = useState(false);
  const previewURL = files ? URL.createObjectURL(files[0]) : undefined;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFiles(e.dataTransfer?.files || null);
    setDragover(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
      setDragover(true);
    }
  };

  return (
    <div className="flex flex-col">
      {label && <Label htmlFor={id}>{label}</Label>}
      <label
        className={`flex flex-col items-center px-8 py-4 mx-auto w-full rounded-xl
          border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black
          cursor-pointer transition-colors
          ${dragover ? "border-sky-500 text-sky-500" : ""}
          ${url ? "rounded-b-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragover(false)}
      >
        {files ? (
          <img
            src={previewURL}
            onLoad={() => previewURL && URL.revokeObjectURL(previewURL)}
            className="w-full max-w-sm h-full rounded-lg"
            alt="Preview"
          />
        ) : (
          <>
            <FilePlusIcon className="opacity-50 w-9 h-9" />
            <p className="text-sm opacity-50">Attach a file</p>
          </>
        )}
        <input
          type="file"
          id={id}
          onChange={(e) => setFiles(e.target.files)}
          accept={accept}
          className="hidden"
        />
      </label>
      {url !== undefined && (
        <Input
          className="rounded-t-none border-t-0 rounded-xl"
          placeholder="https://example.com/img1.png"
        />
      )}
    </div>
  );
};

export { ImageInput };
