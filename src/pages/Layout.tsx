
import { Container } from "@mui/material";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <Container style={{ flexGrow: 1, marginTop: '40px'}}>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}
