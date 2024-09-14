import React from 'react';
import Link from 'next/link';

import { cn } from '@fucina/utils';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn('cursor-pointer', className)}>
      <Link href="/">
        <div className="flex justify-center items-center gap-2">
          <svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.6692 28H1.96712L0 22.9604H21.6364L19.6692 28Z"
              fill="url(#paint0_linear_178_267)"
            />
            <path
              d="M20.5123 16.661C20.5123 17.2459 20.459 17.8174 20.3605 18.3743C20.1919 19.301 19.891 20.183 19.4781 21.0004H13.5942C13.9595 20.7735 14.2937 20.505 14.5918 20.1941C14.859 19.9196 15.0919 19.6119 15.2914 19.2812C15.7521 18.5168 16.0164 17.6182 16.0164 16.6606C16.0164 16.3588 15.9902 15.8329 15.8137 15.2337C15.1881 13.1093 13.4249 12.5976 11.4689 9.82812C11.1823 9.42257 10.9704 9.08 10.846 8.87208C10.5539 9.67683 10.2569 10.8119 10.2558 12.1814C10.2554 12.7509 10.3062 13.2685 10.3802 13.7232C10.402 13.8444 10.5332 14.6483 9.97513 15.3291C9.55063 15.8471 8.987 15.9766 8.82006 16.0087C8.09784 15.1913 7.51076 14.2507 7.0946 13.223C6.83624 13.5057 6.61127 13.8139 6.42286 14.1469C6.00154 14.8887 5.75987 15.7457 5.75987 16.661C5.75987 18.4919 6.72654 20.099 8.18211 21.0004H2.15792C1.4977 19.6958 1.12407 18.223 1.12407 16.661C1.12407 12.8646 3.32134 9.58059 6.52184 8.00158C6.87321 5.87089 7.92096 3.97545 9.42184 2.5505C10.7983 1.24317 12.5548 0.330297 14.5131 0C14.2127 0.879208 14.0497 1.82257 14.0497 2.80238C14.0497 3.36238 14.1029 3.90812 14.2043 4.43723C14.5275 6.12832 15.3423 7.64277 16.497 8.83287C16.497 8.83287 16.497 8.83564 16.4997 8.83564C18.6263 10.7671 19.7503 12.7402 20.0707 13.7723C20.3791 14.7659 20.4729 15.8071 20.4729 15.8071C20.5012 16.0871 20.5123 16.3727 20.5123 16.661Z"
              fill="url(#paint1_linear_178_267)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_178_267"
                x1="0"
                y1="14"
                x2="21.6364"
                y2="14"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EDE9FE" />
                <stop offset="0.425" stopColor="#C026D3" />
                <stop offset="1" stopColor="#3B0764" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_178_267"
                x1="0"
                y1="14"
                x2="21.6364"
                y2="14"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EDE9FE" />
                <stop offset="0.425" stopColor="#C026D3" />
                <stop offset="1" stopColor="#3B0764" />
              </linearGradient>
            </defs>
          </svg>
          <span className="pt-0.5 font-brand font-medium text-2xl">Feely</span>
        </div>
      </Link>
    </div>
  );
}
