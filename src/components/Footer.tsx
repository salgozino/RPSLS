import { Grid, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function Footer() {
    const theme = useTheme()
  return (
    <Grid container
      justifyContent={'center'}
      alignContent={'center'}
      sx={{ position: "absolute", bottom: 0, width: "100%", height: "2.5rem", backgroundColor: theme.palette.primary.main }}
    >
      <Grid item><Typography color="white">This page is a Demo. Use at your own risk.</Typography></Grid>
    </Grid>
  );
}
