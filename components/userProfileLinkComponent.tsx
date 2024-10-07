import useOpenUserTab from "@/utils/useOpenUserTab";
import Link, { LinkProps } from "next/link";
import React from "react";

interface IProps {
  children: React.ReactNode;
  userId: string | null;
  className?: string;
}

const UserProfileLinkComponent = ({
  userId,
  children,
  ...linkProps
}: IProps & Omit<LinkProps, "href">) => {
  const userPageLink = useOpenUserTab({ userId });
  return (
    <Link href={userPageLink} {...linkProps}>
      {children}
    </Link>
  );
};

export default UserProfileLinkComponent;
