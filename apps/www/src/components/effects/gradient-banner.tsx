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

import React, { useEffect, useState } from "react";
import { Gradient } from "stripe-gradient";

export default function GradientBanner({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [gradientId, setGradientId] = useState("gradient-banner");

  useEffect(() => {
    setGradientId("gradient-banner");
    const gradient = new Gradient();
    gradient.initGradient("#" + gradientId);
  }, [gradientId]);

  return (
    <div className="fixed top-0 left-0 backdrop-blur">
      <canvas
        id={gradientId}
        data-js-darken-top
        className="w-screen blur-sm h-[4rem] border-b z-1"
        style={
          {
            "--gradient-color-1": "#6ec3f4",
            "--gradient-color-2": "#3a3aff",
            "--gradient-color-3": "#ff61ab",
            "--gradient-color-4": "#E63946",
            webKitMaskImage: "linear-gradient(to top, transparent, black)",
            maskImage: "linear-gradient(to top, transparent, black)",
          } as React.CSSProperties
        }
        height="64"
        width={window.screen.width}
      />{" "}
      <div className="fixed top-0 left-0 z-2 p-2 text-left text-black dark:text-white">
        {children}
      </div>
    </div>
  );
}
