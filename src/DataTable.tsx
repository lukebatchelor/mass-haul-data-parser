import React from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

type RPTData = Array<Array<string>>;
function parseRptString(rptString: string): RPTData {
  return rptString
    .split('Volumes from')
    .map((part) => {
      if (!part.match(/Chainage \d+ to \d+/)) return null;
      const chainageStr = part.match(/Chainage \d+ to \d+/)[0];
      const cut = part.match(/Total cut .+ (-?\d+\.\d+)/)[1];
      const fill = part.match(/Total fill .+ (-?\d+\.\d+)/)[1];
      const balance = part.match(/Total balance .+ (-?\d+\.\d+)/)[1];

      return [chainageStr, cut, fill, balance];
    })
    .filter(Boolean);
}

type DataTableProps = {
  rptFileString: string;
};
export function DataTable(props: DataTableProps) {
  const classes = useStyles();
  const rptData = parseRptString(props.rptFileString);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="Mass Haul Data">
        <TableHead>
          <TableRow>
            <TableCell>Chainage</TableCell>
            <TableCell>Cut</TableCell>
            <TableCell>Fill</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rptData.map((data) => (
            <TableRow>
              <TableCell>{data[0]}</TableCell>
              <TableCell>{data[1]}</TableCell>
              <TableCell>{data[2]}</TableCell>
              <TableCell>{data[3]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
