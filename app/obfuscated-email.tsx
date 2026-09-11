"use client";

import { useSyncExternalStore, type ReactNode } from "react";

type EncodedEmail = readonly number[];

const subscribe = () => () => {};
const getServerSnapshot = () => null;

function useDecodedEmail(encoded: EncodedEmail) {
  return useSyncExternalStore(
    subscribe,
    () => String.fromCharCode(...encoded),
    getServerSnapshot,
  );
}

type ObfuscatedEmailLinkProps = {
  encoded: EncodedEmail;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export function ObfuscatedEmailLink({
  encoded,
  className,
  ariaLabel,
  children,
}: ObfuscatedEmailLinkProps) {
  const email = useDecodedEmail(encoded);

  if (!email) {
    return (
      <span className={className} aria-hidden="true">
        {children}
      </span>
    );
  }

  return (
    <a className={className} href={`mailto:${email}`} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

type ObfuscatedEmailAddressProps = {
  encoded: EncodedEmail;
  className?: string;
};

export function ObfuscatedEmailAddress({
  encoded,
  className,
}: ObfuscatedEmailAddressProps) {
  const email = useDecodedEmail(encoded);

  return <span className={className}>{email}</span>;
}
