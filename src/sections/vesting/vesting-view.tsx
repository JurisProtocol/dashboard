import { useState, useCallback, useEffect } from 'react';

import { useVestingRound, VestingRoundName } from 'src/hooks/vesting-round';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Divider } from '@mui/material';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { VestingTableRow } from './vesting-table-row';
import { VestingTableHead } from './vesting-table-head';
import { TableEmptyRows } from './table-empty-rows';
import { VestingTableToolbar } from './vesting-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';

import type { VestingProps } from './vesting-table-row';

// ----------------------------------------------------------------------

export function VestingView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const vestingRound = useVestingRound();
  const [filteredRows, setFilteredRows] = useState([] as VestingProps[]);

  useEffect(() => {
    const weightArray = Array.isArray(vestingRound.weights) ? vestingRound.weights : [];
    const weightArrayFiltered = weightArray.filter((row) => {
      const regex = new RegExp(filterName, 'i');
      return regex.test(row.address);
    });
    const sortedRows = weightArrayFiltered.sort((a, b) => b.weight - a.weight );
    const weightArrayMapped = sortedRows.map((row) => {
      const allocated = vestingRound.total * row.weight / 1000000;
      return {
        address: row.address,
        weight: row.weight.toLocaleString('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }),
        totalVested: allocated.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      } as VestingProps;
    });
    setFilteredRows(weightArrayMapped);
  }, [filterName, vestingRound.round, vestingRound.weights]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Vesting Overview
        </Typography>
      </Box>

      <Card>
        <VestingTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <VestingTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={filteredRows.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'dummy', label: '' },
                  { id: 'address', label: 'Address' },
                  { id: 'share', label: 'Share' },
                  { id: 'totalVested', label: 'Allocated Juris Tokens' },
                ]}
              />
              <TableBody>
                {filteredRows
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <VestingTableRow row={{ address: row.address, weight: row.weight, totalVested: row.totalVested }} />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, filteredRows.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>
    

        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={filteredRows.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
        <Divider />
          <Box display="flex" alignContent="center" alignItems="center" sx={{ margin: 5 }}>
            <Button sx={{ marginRight: 2 }} onClick={() => vestingRound.setRound(VestingRoundName.LOCKDROP)} variant={vestingRound.round === VestingRoundName.LOCKDROP ? 'contained' : 'text'}>Lockdrop</Button>
            <Button sx={{ marginRight: 2 }} onClick={() => vestingRound.setRound(VestingRoundName.INVESTORS)} variant={vestingRound.round === VestingRoundName.INVESTORS ? 'contained' : 'text'}>Investors</Button>
            <Button sx={{ marginRight: 2 }} onClick={() => vestingRound.setRound(VestingRoundName.SHIRINI)} variant={vestingRound.round === VestingRoundName.SHIRINI ? 'contained' : 'text'}>Shirini</Button>
          </Box>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
