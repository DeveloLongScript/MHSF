"use client";
import { useTheme } from "next-themes";
import type { SVGProps } from "react";

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

  if (resolvedTheme == "dark") {
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
  } else {
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
}
