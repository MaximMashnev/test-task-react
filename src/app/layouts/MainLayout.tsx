import {Typography, Toolbar, Button, Box, AppBar} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppsIcon from '@mui/icons-material/Apps';
import { PATHS, STORAGE_KEYS } from "../../shared/consts";
import authService from "../../features/auth/services";
import { useState } from "react";

export default function MainLayout() {

  const [isAuth, setIsAuth] = useState<string | null>(localStorage.getItem(STORAGE_KEYS.TOKEN));

  const handleLogout = () => {
    authService.logout();
    setIsAuth(null);
  }

  return(
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
              <Link to={"/"} style={{textDecoration: "none", color: "white"}}>СтроительнаяКомпания</Link>
            </Typography>
            {
              isAuth ? (
                <>
                  <Button color="inherit" endIcon={<AppsIcon />} href={PATHS.TOOLPAD}>
                    Панель инструментов
                  </Button >
                  <Button color="inherit" endIcon={<LogoutIcon />} onClick={handleLogout}>
                    Выйти
                  </Button >
                </>
              ) : (
                <Button color="inherit" endIcon={<LoginIcon />} href={PATHS.LOGIN}>
                  Авторизоваться
                </Button >
              )
            }
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1}}>
          <Outlet />
        </Box>
      </Box>         
    </>
  )
}