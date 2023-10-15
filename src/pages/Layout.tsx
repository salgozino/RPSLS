
import { Container } from "@mui/material";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{display: 'flex',  flexDirection: 'column', minHeight: "100vh"}}>
      <Header />
      <Container style={{ flexGrow: 1, maxWidth: '1024px', justifyContent: 'space-around'}}>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
