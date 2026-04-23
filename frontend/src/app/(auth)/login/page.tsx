import LoginClient from './LoginClient';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;

  return <LoginClient from={params.from} />;
}