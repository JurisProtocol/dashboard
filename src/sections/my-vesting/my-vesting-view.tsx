

import { useVestingRound, VestingRoundName } from 'src/hooks/vesting-round';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Divider, List, ListItem, Tab, TableCell, TableHead, TableRow } from '@mui/material';


export function MyVestingView() {

    const vestingRound = useVestingRound();

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    My Vesting
                </Typography>
            </Box>

            <Card>
                <Typography variant='h6' sx={{margin: 4}}>Vesting for [Connected Address]</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Total Allocated</TableCell>
                                <TableCell>0.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Claimable</TableCell>
                                <TableCell>0.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Remaining Claims</TableCell>
                                <TableCell>0.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Claimed</TableCell>
                                <TableCell>0.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider />
                <Box display="flex" alignContent="center" alignItems="center" sx={{margin:5}}>
                    <Button sx={{marginRight: 2}} onClick={() => vestingRound.setRound(VestingRoundName.LOCKDROP)} variant={vestingRound.round === VestingRoundName.LOCKDROP ? 'contained' : 'text'}>Lockdrop</Button>
                    <Button sx={{marginRight: 2}} onClick={() => vestingRound.setRound(VestingRoundName.INVESTORS)} variant={vestingRound.round === VestingRoundName.INVESTORS ? 'contained' : 'text'}>Investors</Button>
                    <Button sx={{marginRight: 2}} onClick={() => vestingRound.setRound(VestingRoundName.SHIRINI)} variant={vestingRound.round === VestingRoundName.SHIRINI ? 'contained' : 'text'}>Shirini</Button>
                </Box>
            </Card>
        </DashboardContent>
    );
}