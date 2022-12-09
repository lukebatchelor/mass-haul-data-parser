import React, { useCallback, useRef, useState } from 'react';
import {
  makeStyles,
  Avatar,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Paper,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useDropzone } from 'react-dropzone';
import Confetti from 'react-confetti';
import useKonami from 'react-use-konami';

import { DataTable } from './DataTable';

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: theme.palette.success.main,
  },
  paper: {
    textAlign: 'center',
    minHeight: '50vh',
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

// https://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
function selectText(node: HTMLElement) {
  const documentBody = document.body as any;
  if (documentBody.createTextRange) {
    const range = documentBody.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn('Could not select text in node: Unsupported browser.');
  }
}

type AppProps = {
  children?: React.ReactNode;
};
export function App(props: AppProps) {
  const classes = useStyles();
  const [rptString, setRptString] = useState<string>(null);
  const dataTableEl = useRef(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [makeCutsPositive, setMakeCutsPositive] = useState<boolean>(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const text = await file.text();
    setRptString(text);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useKonami(() => setShowConfetti(true));

  const reset = () => setRptString(null);
  const selectAll = () => {
    selectText(dataTableEl.current);
  };
  const onCutsPositiveChange = (e: React.ChangeEvent<HTMLInputElement>) => setMakeCutsPositive(e.target.checked);

  return (
    <Container>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="Home" edge="start">
            <Avatar src="/android-chrome-192x192.png" alt="LB" className={classes.avatar} />
          </IconButton>

          <Typography variant="h5">Mass Haul Data Parser</Typography>
        </Toolbar>
      </AppBar>
      <Box mt={12} />
      {!rptString && (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
          <Typography variant="h5" align="center" style={{ textDecoration: 'underline' }}>
            A very minimal app for parsing .rpt files
          </Typography>
          <Box mt={15} />
          <Paper {...getRootProps()} className={classes.paper}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              justifyItems="center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography variant="h5">Drop the files here ...</Typography>
              ) : (
                <>
                  <Typography variant="h5">Drag 'n' drop some files here, or click to select files</Typography>
                  <AttachFileIcon fontSize="large" style={{ marginTop: '40px' }} />
                </>
              )}
            </Box>
          </Paper>
        </Box>
      )}
      {rptString && (
        <>
          <Box mt={10} mb={5} display="flex" justifyContent="space-evenly">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={makeCutsPositive} onChange={onCutsPositiveChange} />}
                label="Make cuts positive"
              />
            </FormGroup>
            <Button variant="contained" color="primary" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="contained" color="secondary" onClick={reset}>
              Reset
            </Button>
          </Box>
          <Paper className={classes.paper}>
            <DataTable
              rptFileString={rptString}
              dataTableId="data-table"
              dataTableRef={dataTableEl}
              makeCutsPositive={makeCutsPositive}
            />
          </Paper>
        </>
      )}
      {showConfetti && <Confetti />}
    </Container>
  );
}
