import {Typography, Toolbar, Button, Box, AppBar} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export default function MainLayout() {
    return(
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                <Link to={"/"} style={{textDecoration: "none", color: "white"}}>СтроительнаяКомпания</Link>
              </Typography>
              <Button color="inherit" endIcon={<LoginIcon />} href="login">
                Авторизоваться
              </Button >
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ flex: 1}}>
            <Outlet />
          </Box>
        </Box>         
      </>
    )
}