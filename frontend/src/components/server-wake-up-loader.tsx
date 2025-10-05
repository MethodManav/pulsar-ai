import { cn } from "@/lib/utils";

export interface ServerWakeUpLoaderProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export function ServerWakeUpLoader({
  message = "Please wait, let me wake up the server…",
  fullscreen = true,
  className,
}: ServerWakeUpLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "w-full flex items-center justify-center p-6",
        fullscreen && "min-h-[100svh]",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Spinner + pulsing ring + bouncing cup */}
        <div className="relative size-24">
          {/* Subtle pulsing aura */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/10 animate-ping"
          />
          {/* Spinning ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"
          />
          {/* Bouncing coffee cup icon */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center motion-reduce:animate-none animate-bounce"
          >
            <CoffeeCup className="size-10 text-primary" />
          </div>
        </div>

        <p className="text-pretty text-sm md:text-base text-muted-foreground">
          {message}
        </p>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}

function CoffeeCup({ className }: { className?: string }) {
  // Simple coffee cup with steam lines
  return (
    <svg
      className={cn("stroke-current", className)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Waking up coffee"
    >
      {/* Cup */}
      <path
        d="M8 18h22a0 0 0 0 1 0 0v8a10 10 0 0 1 -10 10H18A10 10 0 0 1 8 26v-8a0 0 0 0 1 0 0Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M8 18h22v8a10 10 0 0 1 -10 10H18A10 10 0 0 1 8 26v-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path
        d="M30 20h4a5 5 0 0 1 0 10h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Saucer */}
      <path
        d="M10 38h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Steam */}
      <path
        d="M16 10c2 2 0 3 0 5M22 9c2 2 0 3 0 5M28 10c2 2 0 3 0 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-70 animate-pulse"
      />
    </svg>
  );
}

export default ServerWakeUpLoader;
