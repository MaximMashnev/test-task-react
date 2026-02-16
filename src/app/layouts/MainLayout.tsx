import {Typography, Toolbar, Button, Box, AppBar} from "@mui/material";
import { Outlet } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';

export default function MainLayout() {
    return(
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                СтроительнаяКомпания
              </Typography>
              <Button color="inherit" endIcon={<LoginIcon />}>
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