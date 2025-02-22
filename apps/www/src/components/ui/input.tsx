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

import type React from "react";
import { Label } from "@/components/ui/label";
import { generateID } from "@/lib/form-helper";

export type Size = "sm" | "md" | "lg";
export type Shadow = "sm" | "none";

const sizeClass = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-3",
};

const shadowClass = {
  sm: "shadow-xs",
  none: "shadow-none",
};

interface InputWithLabelProps {
  label?: string;
  value?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: Size;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  shadow?: Shadow;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputWithLabelProps> = ({
  label,
  value,
  placeholder = "",
  disabled = false,
  required = false,
  id = generateID(),
  size = "md",
  suffix,
  prefix,
  shadow = "none",
  className = "",
  onChange,
}) => {
  const borderClass =
    "border border-slate-200 border-b-slate-300 dark:border-zinc-800 dark:border-t-zinc-700";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <Label
          htmlFor={id}
          className={`peer-invalid:text-red-500 ${
            required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""
          }`}
        >
          {label}
        </Label>
      )}
      <div
        className={`${shadowClass[shadow-sm]} border ${borderClass} focus-within:border-primary-900 dark:focus-within:border-primary-100 focus-within:ring-2 ring-slate-300 dark:ring-zinc-700 transition-colors rounded-lg flex flex-row items-center text-sm ${className}`}
      >
        {prefix && (
          <div
            className={`rounded-lg rounded-r-none text-slate-600 dark:text-zinc-400 ${sizeClass[size]}`}
          >
            {prefix}
          </div>
        )}
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`${sizeClass[size]} bg-white dark:bg-zinc-950 focus:outline-hidden rounded-lg text-sm w-full disabled:bg-slate-100 disabled:cursor-not-allowed invalid:border-red-500! peer invalid:text-red-500 z-10 ${className}`}
        />
        {suffix && (
          <div
            className={`rounded-lg rounded-l-none text-slate-600 dark:text-zinc-400 ${sizeClass[size]}`}
          >
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export { Input };
