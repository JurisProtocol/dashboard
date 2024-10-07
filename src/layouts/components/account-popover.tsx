import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useRouter, usePathname } from 'src/routes/hooks';

import { _myAccount } from 'src/_mock';
import { Icon } from '@mui/material';
import { Label } from '@mui/icons-material';

// ----------------------------------------------------------------------

import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import { WalletContext } from 'src/wallet/wallet-provider';
import { connect } from 'http2';
import { WalletName } from 'cosmes/wallet';

interface AccountPopoverProps extends IconButtonProps {
  sx?: SxProps<Theme>;
}

export function AccountPopover({ sx, ...other }: AccountPopoverProps) {
  const router = useRouter();

  const pathname = usePathname();

  const walletContext = useContext(WalletContext);

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `${theme.vars.palette.primary.lightChannel}`,
          ...sx,
        }}
        {...other}
      >
        <IconButton>
          <AccountBalanceWalletIcon />
        </IconButton>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          <MenuItem
            key="connect_keplr"
            onClick={() => { walletContext.connect(WalletName.KEPLR) }}
          >
            <Icon />
            <Typography>Keplr</Typography>
          </MenuItem>
          <MenuItem
            key="connect_galaxy"
            onClick={() => { }}
          >
            <Icon />
            <Typography>Galaxy</Typography>
          </MenuItem>
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {walletContext.connected &&
          <Box sx={{ p: 1 }}>
            <Button fullWidth color="error" size="medium" variant="text" onClick={ () => walletContext.disconnect() }>
              Disconnect
            </Button>
          </Box>
        }
      </Popover>
    </>
  );
}
