import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VestingView } from 'src/sections/vesting/vesting-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Vesting Overview - ${CONFIG.appName}`}</title>
      </Helmet>

      <VestingView />
    </>
  );
}
