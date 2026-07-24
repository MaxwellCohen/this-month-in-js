import { unstable_redirect } from 'waku/router/server';

import { currentMonthSlug } from '../lib/months';

export default async function HomePage() {
  unstable_redirect(`/${currentMonthSlug()}`);
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
