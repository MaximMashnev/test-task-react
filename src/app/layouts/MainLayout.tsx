import {Typography, Toolbar, Button, Box, AppBar} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import { PATHS } from "../../shared/consts";

export default function MainLayout() {
    return(
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                <Link to={"/"} style={{textDecoration: "none", color: "white"}}>СтроительнаяКомпания</Link>
              </Typography>
              {/* TODO Если пользователь авторизован, то отображать кнопку на панель инструментов и кнопку "Выйти" */}
              <Button color="inherit" endIcon={<LoginIcon />} href={PATHS.LOGIN}>
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