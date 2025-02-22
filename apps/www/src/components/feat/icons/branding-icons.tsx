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
import { useTheme } from "next-themes";
import type { SVGProps } from "react";

export const brandingIconClipboard = `<svg width="266" height="265" viewBox="0 0 266 265" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.524048" width="264.939" height="264.939" rx="66" fill="url(#paint0_linear_1_19)"/>
<path d="M104.513 123.27H94.8717C92.3148 123.27 89.8626 122.254 88.0546 120.446C86.2466 118.638 85.2309 116.186 85.2309 113.629V94.3476C85.2309 91.7907 86.2466 89.3385 88.0546 87.5305C89.8626 85.7225 92.3148 84.7068 94.8717 84.7068H171.998C174.555 84.7068 177.007 85.7225 178.815 87.5305C180.623 89.3385 181.639 91.7907 181.639 94.3476V113.629C181.639 116.186 180.623 118.638 178.815 120.446C177.007 122.254 174.555 123.27 171.998 123.27H162.357M104.513 142.552H94.8717C92.3148 142.552 89.8626 143.567 88.0546 145.376C86.2466 147.184 85.2309 149.636 85.2309 152.193V171.474C85.2309 174.031 86.2466 176.483 88.0546 178.291C89.8626 180.099 92.3148 181.115 94.8717 181.115H171.998C174.555 181.115 177.007 180.099 178.815 178.291C180.623 176.483 181.639 174.031 181.639 171.474V152.193C181.639 149.636 180.623 147.184 178.815 145.376C177.007 143.567 174.555 142.552 171.998 142.552H162.357M104.513 103.988H104.561M104.513 161.833H104.561M138.255 103.988L118.974 132.911H147.896L128.615 161.833" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="132.993" cy="132.469" r="91.3779" stroke="url(#paint1_linear_1_19)" stroke-width="8"/>
<defs>
<linearGradient id="paint0_linear_1_19" x1="107.824" y1="54.754" x2="230.579" y2="225.198" gradientUnits="userSpaceOnUse">
<stop stop-color="#007BFF"/>
<stop offset="1" stop-color="#BF00FF" stop-opacity="0.5"/>
</linearGradient>
<linearGradient id="paint1_linear_1_19" x1="132.993" y1="37.0914" x2="132.993" y2="227.847" gradientUnits="userSpaceOnUse">
<stop stop-color="#EFEC32"/>
<stop offset="1" stop-color="#98FF60"/>
</linearGradient>
</defs>
</svg>`;

/**
 * Returns a colorful version of the branding icon.
 *
 * The stored SVG file is at `/public/svg/icon-cf.svg`
 *
 * @param props The props for the SVG element.
 * @returns A JSX element representing the colorful branding icon.
 */
export function BrandingColorfulIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="266"
      height="265"
      viewBox="0 0 266 265"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.524048"
        width="264.939"
        height="264.939"
        rx="66"
        fill="url(#paint0_linear_1_19)"
      />
      <path
        d="M104.513 123.27H94.8717C92.3148 123.27 89.8626 122.254 88.0546 120.446C86.2466 118.638 85.2309 116.186 85.2309 113.629V94.3476C85.2309 91.7907 86.2466 89.3385 88.0546 87.5305C89.8626 85.7225 92.3148 84.7068 94.8717 84.7068H171.998C174.555 84.7068 177.007 85.7225 178.815 87.5305C180.623 89.3385 181.639 91.7907 181.639 94.3476V113.629C181.639 116.186 180.623 118.638 178.815 120.446C177.007 122.254 174.555 123.27 171.998 123.27H162.357M104.513 142.552H94.8717C92.3148 142.552 89.8626 143.567 88.0546 145.376C86.2466 147.184 85.2309 149.636 85.2309 152.193V171.474C85.2309 174.031 86.2466 176.483 88.0546 178.291C89.8626 180.099 92.3148 181.115 94.8717 181.115H171.998C174.555 181.115 177.007 180.099 178.815 178.291C180.623 176.483 181.639 174.031 181.639 171.474V152.193C181.639 149.636 180.623 147.184 178.815 145.376C177.007 143.567 174.555 142.552 171.998 142.552H162.357M104.513 103.988H104.561M104.513 161.833H104.561M138.255 103.988L118.974 132.911H147.896L128.615 161.833"
        stroke="white"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="132.993"
        cy="132.469"
        r="91.3779"
        stroke="url(#paint1_linear_1_19)"
        stroke-width="8"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_19"
          x1="107.824"
          y1="54.754"
          x2="230.579"
          y2="225.198"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#007BFF" />
          <stop offset="1" stop-color="#BF00FF" stop-opacity="0.5" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_19"
          x1="132.993"
          y1="37.0914"
          x2="132.993"
          y2="227.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EFEC32" />
          <stop offset="1" stop-color="#98FF60" />
        </linearGradient>
      </defs>
    </svg>
  );
}
/**
 * Returns the optional Pride icon
 *
 * The stored SVG file is at `/public/svg/icon-p.svg`
 *
 * @param {SVGProps<SVGSVGElement>} props The props for the SVG element.
 * @returns A JSX element representing the branding icon.
 */
export function BrandingPrideIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="265"
      height="265"
      viewBox="0 0 265 265"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="264.939"
        height="264.939"
        rx="66"
        fill="url(#paint0_linear_1_30)"
      />
      <path
        d="M103.988 123.27H94.3476C91.7907 123.27 89.3385 122.254 87.5305 120.446C85.7225 118.638 84.7068 116.186 84.7068 113.629V94.3476C84.7068 91.7907 85.7225 89.3385 87.5305 87.5305C89.3385 85.7225 91.7907 84.7068 94.3476 84.7068H171.474C174.031 84.7068 176.483 85.7225 178.291 87.5305C180.099 89.3385 181.115 91.7907 181.115 94.3476V113.629C181.115 116.186 180.099 118.638 178.291 120.446C176.483 122.254 174.031 123.27 171.474 123.27H161.833M103.988 142.552H94.3476C91.7907 142.552 89.3385 143.567 87.5305 145.376C85.7225 147.184 84.7068 149.636 84.7068 152.193V171.474C84.7068 174.031 85.7225 176.483 87.5305 178.291C89.3385 180.099 91.7907 181.115 94.3476 181.115H171.474C174.031 181.115 176.483 180.099 178.291 178.291C180.099 176.483 181.115 174.031 181.115 171.474V152.193C181.115 149.636 180.099 147.184 178.291 145.376C176.483 143.567 174.031 142.552 171.474 142.552H161.833M103.988 103.988H104.037M103.988 161.833H104.037M137.731 103.988L118.45 132.911H147.372L128.091 161.833"
        stroke="white"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="132.469"
        cy="132.469"
        r="91.3779"
        stroke="url(#paint1_linear_1_30)"
        stroke-width="8"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_30"
          x1="51.6631"
          y1="26.9354"
          x2="222.549"
          y2="213.717"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF0000" />
          <stop offset="0.110405" stop-color="#FF6200" />
          <stop offset="0.225785" stop-color="#FFAE00" />
          <stop offset="0.326294" stop-color="#FFD500" />
          <stop offset="0.422381" stop-color="#99EA00" />
          <stop offset="0.498373" stop-color="#4DF457" />
          <stop offset="0.593491" stop-color="#26D3AB" />
          <stop offset="0.699814" stop-color="#13A9D5" />
          <stop offset="0.805673" stop-color="#A200FF" />
          <stop offset="0.884464" stop-color="#C62AEB" />
          <stop offset="0.957056" stop-color="white" />
          <stop offset="0.997383" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_30"
          x1="132.469"
          y1="37.0914"
          x2="132.469"
          y2="227.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EFEC32" />
          <stop offset="1" stop-color="#98FF60" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Returns the branding icon based on the current theme.
 *
 * If the theme is dark, the branding icon is a dark version of the logo.
 * If the theme is light, the branding icon is a light version of the logo.
 *
 * The stored SVG file is at `/public/svg/icon-gl.svg` or `/public/svg/icon-gd.svg`
 *
 * @param {SVGProps<SVGSVGElement>} props The props for the SVG element.
 *
 * @returns A JSX element representing the branding icon.
 */
export function BrandingGenericIcon(props: SVGProps<SVGSVGElement>) {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark") {
    return (
      <svg
        width="265"
        height="266"
        viewBox="0 0 265 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect
          x="0.0612793"
          y="0.86145"
          width="264.939"
          height="264.939"
          rx="66"
          fill="url(#paint0_linear_1_20)"
        />
        <path
          d="M104.05 124.132H94.4089C91.852 124.132 89.3998 123.116 87.5918 121.308C85.7838 119.5 84.7681 117.048 84.7681 114.491V95.2091C84.7681 92.6522 85.7838 90.2 87.5918 88.392C89.3998 86.584 91.852 85.5683 94.4089 85.5683H171.536C174.092 85.5683 176.545 86.584 178.353 88.392C180.161 90.2 181.176 92.6522 181.176 95.2091V114.491C181.176 117.048 180.161 119.5 178.353 121.308C176.545 123.116 174.092 124.132 171.536 124.132H161.895M104.05 143.413H94.4089C91.852 143.413 89.3998 144.429 87.5918 146.237C85.7838 148.045 84.7681 150.497 84.7681 153.054V172.336C84.7681 174.893 85.7838 177.345 87.5918 179.153C89.3998 180.961 91.852 181.977 94.4089 181.977H171.536C174.092 181.977 176.545 180.961 178.353 179.153C180.161 177.345 181.176 174.893 181.176 172.336V153.054C181.176 150.497 180.161 148.045 178.353 146.237C176.545 144.429 174.092 143.413 171.536 143.413H161.895M104.05 104.85H104.098M104.05 162.695H104.098M137.793 104.85L118.511 133.772H147.433L128.152 162.695"
          stroke="white"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="132.531"
          cy="133.331"
          r="91.3779"
          stroke="url(#paint1_linear_1_20)"
          stroke-width="8"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_20"
            x1="107.361"
            y1="55.6155"
            x2="230.116"
            y2="226.059"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1_20"
            x1="132.531"
            y1="37.9529"
            x2="132.531"
            y2="228.709"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#EFEC32" />
            <stop offset="1" stop-color="#98FF60" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      width="265"
      height="265"
      viewBox="0 0 265 265"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.0612793"
        width="264.939"
        height="264.939"
        rx="66"
        fill="url(#paint0_linear_1_25)"
      />
      <path
        d="M104.05 123.27H94.4089C91.852 123.27 89.3998 122.254 87.5918 120.446C85.7838 118.638 84.7681 116.186 84.7681 113.629V94.3476C84.7681 91.7907 85.7838 89.3385 87.5918 87.5305C89.3998 85.7225 91.852 84.7068 94.4089 84.7068H171.536C174.092 84.7068 176.545 85.7225 178.353 87.5305C180.161 89.3385 181.176 91.7907 181.176 94.3476V113.629C181.176 116.186 180.161 118.638 178.353 120.446C176.545 122.254 174.092 123.27 171.536 123.27H161.895M104.05 142.552H94.4089C91.852 142.552 89.3998 143.567 87.5918 145.376C85.7838 147.184 84.7681 149.636 84.7681 152.193V171.474C84.7681 174.031 85.7838 176.483 87.5918 178.291C89.3998 180.099 91.852 181.115 94.4089 181.115H171.536C174.092 181.115 176.545 180.099 178.353 178.291C180.161 176.483 181.176 174.031 181.176 171.474V152.193C181.176 149.636 180.161 147.184 178.353 145.376C176.545 143.567 174.092 142.552 171.536 142.552H161.895M104.05 103.988H104.098M104.05 161.833H104.098M137.793 103.988L118.511 132.911H147.433L128.152 161.833"
        stroke="black"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="132.531"
        cy="132.469"
        r="91.3779"
        stroke="url(#paint1_linear_1_25)"
        stroke-width="8"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_25"
          x1="107.361"
          y1="54.754"
          x2="230.116"
          y2="225.198"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_25"
          x1="132.531"
          y1="37.0914"
          x2="132.531"
          y2="227.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EFEC32" />
          <stop offset="1" stop-color="#98FF60" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BadgeOfAffiliation(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="81"
      height="81"
      viewBox="0 0 81 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="81" height="81" rx="34" fill="url(#paint0_linear_1_12)" />
      <path
        d="M29.5 36.5H26C25.0717 36.5 24.1815 36.1313 23.5251 35.4749C22.8687 34.8185 22.5 33.9283 22.5 33V26C22.5 25.0717 22.8687 24.1815 23.5251 23.5251C24.1815 22.8687 25.0717 22.5 26 22.5H54C54.9283 22.5 55.8185 22.8687 56.4749 23.5251C57.1313 24.1815 57.5 25.0717 57.5 26V33C57.5 33.9283 57.1313 34.8185 56.4749 35.4749C55.8185 36.1313 54.9283 36.5 54 36.5H50.5M29.5 43.5H26C25.0717 43.5 24.1815 43.8687 23.5251 44.5251C22.8687 45.1815 22.5 46.0717 22.5 47V54C22.5 54.9283 22.8687 55.8185 23.5251 56.4749C24.1815 57.1313 25.0717 57.5 26 57.5H54C54.9283 57.5 55.8185 57.1313 56.4749 56.4749C57.1313 55.8185 57.5 54.9283 57.5 54V47C57.5 46.0717 57.1313 45.1815 56.4749 44.5251C55.8185 43.8687 54.9283 43.5 54 43.5H50.5M29.5 29.5H29.5175M29.5 50.5H29.5175M41.75 29.5L34.75 40H45.25L38.25 50.5"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_12"
          x1="40.5"
          y1="0"
          x2="40.5"
          y2="81"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#37B14F" />
          <stop offset="1" stop-color="#3D4B17" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const Discord = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 199"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path
      d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
      fill="#5865F2"
    />
  </svg>
);
