import VerifyEmailClient from './VerifyEmailClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;

  return <VerifyEmailClient userId={params.userId} />;
}