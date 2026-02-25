import { useNavigate, useParams } from "react-router-dom"
import applicationsStore from "../../entities/Application/model/store";
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, IconButton, ImageList, ImageListItem, Typography } from "@mui/material";
import { PATHS } from "../../shared/consts";
import HomeIcon from '@mui/icons-material/Home';
import { useEffect, useState } from "react";
import Image from "../../shared/assets/imgs/bgImage.jpg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ApplicationEntity } from "../../entities/Application";
import { FileDTO } from "../../entities/Application/services/dto";
import { ApplicationStatus } from "../../entities/Application/model/types";

export default function ApplicationsTrackingPage() {

    const navigate = useNavigate();
    const params = useParams();
    const applicationId = applicationsStore.linkDecrypting(params.id!);
    const [app, setApp] = useState<ApplicationEntity | null | undefined>(null);
    const [imgs, setImgs] = useState<FileDTO[] | null>(null);

    if (Number.isNaN(applicationId)) {
        navigate(`../${PATHS.MAIN}`);
    }

    useEffect(() => {
        getInfoApp();
    }, [])

    const getInfoApp = async () => {
        const app = await applicationsStore.getApplication(applicationId);
        if (app !== undefined && app !== null) {
            setApp(app);
            if (app.upload_id.length > 0) setImgs(await applicationsStore.getFilesApplication(app.upload_id))
        }
    }

    return (
        <Box 
            sx={{ 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 64px)",
                position: "relative", 
                '&::before': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${Image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px)",
                    zIndex: -1,
                }
            }}>
            <Container sx={{width: 600, bgcolor: "white", borderRadius: "16px", padding: "12px"}}>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h6" component="span">
                        {app ? `Отслеживание заявки ${params.id!}` : "Заявка не найдена"}
                    </Typography>
                    <IconButton href={PATHS.MAIN} title="На главную">
                        <HomeIcon />
                    </IconButton>
                </Box>
                {app ?
                    <>
                        <Typography variant="body1" component="span">
                            Текущей статус заявки: {app.status}
                            {app.reason && <><br />{`Причина: ${app.reason}`}</>}
                        </Typography>                    
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography component="span">
                                    История изменений статуса
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {`Статус "${ApplicationStatus.new}": ${new Date(app.dateSubmission).toLocaleString()}`}
                                {app.dateInProgress && 
                                <><br />{`Статус "${ApplicationStatus.inProgress}": ${new Date(app.dateInProgress).toLocaleString()}`}</>}
                                {app.dateResult 
                                && <><br />{`Статус "${ApplicationStatus.completed}/${ApplicationStatus.rejected}": ${new Date(app.dateResult).toLocaleString()}`}</>}
                            </AccordionDetails>
                        </Accordion>
                        {
                            app.upload_id.length > 0 &&        
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography component="span">
                                        Прикрепленные файлы
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {imgs ? 
                                    <>
                                        <ImageList sx={{ width: 500, maxHeight: 450 }} cols={3} rowHeight={164}>
                                        {imgs.length == 0
                                        ? "Файлы не найдены"
                                        :
                                        imgs.map((item) => (
                                            <ImageListItem key={item.id}>
                                            <img
                                                srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                                alt={item.fileName}
                                                loading="lazy"
                                            />
                                            </ImageListItem>
                                        ))}
                                        </ImageList>                                    
                                    </>
                                    :
                                    "Загрузка..."
                                    }

                                </AccordionDetails>
                            </Accordion>                   
                        }
                    </>
                    :
                    <Typography variant="body1" component="span">
                        {app === null ? "Загрузка..." : <a href={`..${PATHS.MAIN}`}>{`Заявка ${params.id!} не найдена, попробуйте позже`}</a>}
                    </Typography>  
                }
            </Container>
        </Box>
    )
}