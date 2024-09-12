import { cn } from "@fucina/utils";
import GridPattern from "@/components/grid-pattern";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="relative z-50 justify-items-center gap-4 sm:gap-6 grid mt-6 sm:mt-8 max-w-screen-md text-center">
        <h1 className="font-brand font-medium text-6xl brand-gradient">
          Product Template
        </h1>
        <p className="text-xl">
          Open source product template
        </p>
      </div>
      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        strokeDasharray={'4 4'}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]'
        )}
      />
    </main>
  );
}
