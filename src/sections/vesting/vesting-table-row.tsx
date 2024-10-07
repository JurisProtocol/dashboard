import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import PersonIcon from '@mui/icons-material/Person';

// ----------------------------------------------------------------------

export type VestingProps = {
  address: string;
  weight: string;
  totalVested: string;
};

type VestingTableRowProps = {
  row: VestingProps;
};

export function VestingTableRow({ row }: VestingTableRowProps) {

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
        <PersonIcon />
          </Box>
        </TableCell>

        <TableCell>{row.address}</TableCell>

        <TableCell>{row.weight}</TableCell>

        <TableCell>{row.totalVested}</TableCell>

      </TableRow>

    </>
  );
}
