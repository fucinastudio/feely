import Link from 'next/link';

import { Button, Card, Separator } from '@fucina/ui';
import AuthButtons from '@/components/auth/auth-buttons';

const CreateAccount = async () => {
  return (
    <Card className="relative z-30 flex flex-col space-y-6 p-6 sm:p-10 max-w-[400px]">
      <div className="flex flex-col items-center space-y-3 text-center">
        <h1 className="text-heading-section">Create your account</h1>
        <p className="text-description text-md">
          Just click on your favorite social network below and you&apos;re in.
          No forms, no fuss. Let&apos;s get started!
        </p>
      </div>
      <Separator />
      <div className="w-full">
        <AuthButtons />
      </div>
      <div className="items-center gap-4 grid">
        <Separator />
        <div className="flex sm:flex-row flex-col justify-center items-center gap-1 sm:gap-0">
          <p className="text-description text-md">Already have an account?</p>
          <Button variant="link" asChild>
            <Link href={'/login'}>Login</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CreateAccount;
