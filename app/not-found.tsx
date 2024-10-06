import { Button } from '@fucina/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 p-6 w-full h-screen">
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-semibold text-3xl text-center">Not found</h2>
        <p className="text-center text-description">
          Could not find requested resource
        </p>
      </div>
      <Button variant="secondary" className="mt-3" asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
