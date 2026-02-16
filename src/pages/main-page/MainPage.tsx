import { Button, Container, IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import bgImage from "../../shared/assets/imgs/bgImage.jpg";
import { useState } from "react";

export default function MainPage () {
  const [search, setSearch] = useState<string>("");

  return (
    <Container sx={{
        position: "relative", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100%",
        padding: 0,
        flexDirection: "column",
        gap: "1rem",
        '@media(min-width: 600px)' : {
          p: 0,
          maxWidth: "100%"
        },
        '&::before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
          zIndex: -1,
        }
      }}>
      <Paper
        component="form"
        sx={{ display: 'flex', alignItems: 'center', width: 400, zIndex: 1}}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, }}
          placeholder="Найти заявку"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} href={`/application-tracking/${search}`}>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Button variant="contained" href="new-application" fullWidth sx={{width: 400}}>
        Создать заявку
      </Button>
    </Container>
  );
}