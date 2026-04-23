import VerifyEmailNoticeClient from './VerifyEmailNoticeClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;

  return <VerifyEmailNoticeClient userId={params.userId} />;
}