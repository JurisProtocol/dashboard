import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Vesting Overview',
    path: '/vesting',
    icon: icon('ic-user'),
  },
  {
    title: 'My Vesting',
    path: '/my-vesting',
    icon: icon('ic-user'),
  },
];
