import {
    TextField,
    Button,
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Dialog,
    Container
} from '@mui/material';
import { FC, useState} from 'react';
import { ApplicationEntity } from '../../../entities/Application';
import applicationsStore from '../../../entities/Application/model/store';

interface RejectApplicationDialogProps {
    open: boolean;
    data: ApplicationEntity;
    onClose: Function;
}

const RejectApplicationDialog: FC<RejectApplicationDialogProps> = ({open, data, onClose}) => {

    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);
        rejectApplication();
    }

    const handleOnClose = () => {
        onClose();
    }

    const rejectApplication = async () => {
        const application: ApplicationEntity = {
            ...data,
            status: "отклонено",
            reason: reason,
            dateResult: new Date()
        }
        try {
            await applicationsStore.editApplication(application);
            window.alert("Статус заявки обновлен.")
        }
        catch (error) {
            window.alert("Ошибка при обновлении статуса заявки.")
        }
        finally {
            setIsLoading(false);
            handleOnClose();
        }
    }

    return (
      <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
        <DialogTitle>{`Отклонение заявки "${data?.id}"`}</DialogTitle>
        <DialogContent>
            <Container component="form" onSubmit={handleSubmit} id='BuildingForm' sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "6px"
                }}>
                <TextField
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    label="Причина отклонения заявки"
                    multiline
                    maxRows={4}
                    required
                    type="text"
                    disabled={isLoading}
                /> 
            </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} disabled={isLoading}>Отмена</Button>
          <Button type="submit" form="BuildingForm" disabled={isLoading} loading={isLoading}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default RejectApplicationDialog;