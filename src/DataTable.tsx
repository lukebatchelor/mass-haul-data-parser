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
      if (!part.match(/\(with plan polygon ".+?"\)/)) return null;
      const chainageStr = part.match(/\(with plan polygon "(.+?)"\)/)[1];
      const cut = part.match(/Total cut .+ (-?\d+\.\d+)/)[1];
      const fill = part.match(/Total fill .+ (-?\d+\.\d+)/)[1];
      const balance = part.match(/Total balance .+ (-?\d+\.\d+)/)[1];

      return [chainageStr, cut, fill, balance];
    })
    .filter(Boolean);
}

type DataTableProps = {
  rptFileString: string;
  dataTableId: string;
  dataTableRef: React.Ref<HTMLElement>;
  makeCutsPositive: boolean;
};
export function DataTable(props: DataTableProps) {
  const classes = useStyles();
  const rptData = parseRptString(props.rptFileString);
  const makeCutsPositive = props.makeCutsPositive;

  return (
    <TableContainer component={Paper} id={props.dataTableId} ref={props.dataTableRef} innerRef={props.dataTableRef}>
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
          {rptData.map((data, idx) => (
            <TableRow key={idx}>
              <TableCell>{data[0]}</TableCell>
              <TableCell>{makeCutsPositive ? Math.abs(Number(data[1])).toFixed(3) : data[1]}</TableCell>
              <TableCell>{data[2]}</TableCell>
              <TableCell>{data[3]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
