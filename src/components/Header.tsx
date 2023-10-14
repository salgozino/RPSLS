import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Container, Grid, Link, styled } from "@mui/material";

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);


export default function ButtonAppBar() {
  return (
    <>
    <AppBar position="fixed">
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
    <Offset />
    </>
  );
}
