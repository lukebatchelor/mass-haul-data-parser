import React, { useCallback, useState } from 'react';
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
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { DataTable } from './DataTable';

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: theme.palette.success.main,
  },
  paper: {
    textAlign: 'center',
    minHeight: '500px',
    paddingTop: theme.spacing(2),
  },
}));

type AppProps = {
  children?: React.ReactNode;
};
export function App(props: AppProps) {
  const classes = useStyles();
  const [rptString, setRptString] = useState<string>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
    const file = acceptedFiles[0];
    const text = await file.text();
    setRptString(text);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <Paper {...getRootProps()} className={classes.paper}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="h6">Drop the files here ...</Typography>
          ) : (
            <Typography variant="h6">Drag 'n' drop some files here, or click to select files</Typography>
          )}
        </Paper>
      )}
      {rptString && (
        <Paper className={classes.paper}>
          <DataTable rptFileString={rptString} />
        </Paper>
      )}
    </Container>
  );
}
