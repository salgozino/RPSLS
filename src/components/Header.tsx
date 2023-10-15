import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Container, Grid, Link } from "@mui/material";


export default function ButtonAppBar() {
  return (
    <>
    <AppBar position='sticky' sx={{alignSelf: 'flex-start'}}>
      <Container>
        <Toolbar>
          <Grid container spacing={2} justifyContent={'space-between'}>
            <Grid item>

              <Link href='/' color="inherit" variant='h5' underline="none">
                Rock Papper Scissors Lizard Spock
              </Link>

            </Grid>
            <Grid item>
              <ConnectButton />
            </Grid>
          </Grid>
        </Toolbar>
      </Container> 
    </AppBar>
    </>
  );
}
