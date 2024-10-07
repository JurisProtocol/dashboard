import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MyVestingView } from 'src/sections/my-vesting/my-vesting-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`My Vesting - ${CONFIG.appName}`}</title>
      </Helmet>

      <MyVestingView />
    </>
  );
}
