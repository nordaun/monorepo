import { cn } from "@/components/utils";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<SVGElement> {
  className?: string;
  fill?: string;
}

export default function GoogleLogo({ className, fill, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 360 360"
      height="100%"
      className={cn(`${className}`)}
      {...props}
    >
      <path
        fill={fill ? fill : "currentColor"}
        paintOrder="stroke fill markers"
        d="M183.596 0C113.232 0 52.518 40.423 22.9 99.332 10.627 123.551 3.596 150.872 3.596 180s7.03 56.45 19.304 80.668v.16C52.518 319.572 113.232 360 183.596 360c48.6 0 89.333-16.039 119.115-43.53 34.037-31.418 53.693-77.561 53.693-132.38 0-12.763-1.164-25.035-3.291-36.817H183.596v69.705h96.87c-4.254 22.418-17 41.409-36.146 54.173-16.036 10.8-36.506 17.354-60.724 17.354-46.8 0-86.567-31.602-100.803-74.148h-.224l.224-.16c-3.6-10.8-5.72-22.252-5.72-34.197s2.12-23.397 5.72-34.197c14.236-42.546 54.003-74.116 100.803-74.116 26.509 0 50.088 9.142 68.906 26.814l51.52-51.551C272.767 17.822 232.195 0 183.596 0z"
      />
    </svg>
  );
}
