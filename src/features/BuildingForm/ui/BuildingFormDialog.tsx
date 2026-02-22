import {
    TextField,
    Button,
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Dialog,
    Container
} from '@mui/material';
import { FC, useEffect, useState} from 'react';
import { BuildingEntity } from '../../../entities/Buildings';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { NewBuilding } from '../../../entities/Buildings/model/types';
import buildingsStore from '../../../entities/Buildings/model/store';

interface BuildingFormDialogProps {
    open: boolean;
    data: BuildingEntity | null;
    onClose: Function;
}

const BuildingFormDialog: FC<BuildingFormDialogProps> = ({open, data, onClose}) => {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [dateRegistration, setDateRegistration] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && data) {
            setName(data.name);
            setAddress(data.address);
            setDateRegistration(data.dateRegistration);
        }
        else {
            setName("");
            setAddress("");
            setDateRegistration(new Date());
        }
    }, [open, data]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!dateRegistration) {
            window.alert("Выберите дату регистрации.");
            setIsLoading(false);
            return;
        }

        if (data) {
            editBuilding();
        }
        else {
            addBuilding();
        }
    }

    const handleOnClose = () => {
        onClose();
    }

    const editBuilding = async () => {
        const building: BuildingEntity = {
            ...data!,
            name: name,
            address: address,
            dateRegistration: dateRegistration
        }
        try {
            await buildingsStore.editBuilding(building);
            window.alert("Информация об объекте была обновлена.")
        }
        catch (error) {
            window.alert("Ошибка при обновлении информации объекта.")
        }
        finally {
            setIsLoading(false);
            handleOnClose();
        }
    }

    const addBuilding = async () => {
        const building: NewBuilding = {
            name: name,
            address: address,
            dateRegistration: dateRegistration,
            numberApplications: 0
        }
        try {
            await buildingsStore.addBuilding(building);
            window.alert("Новый объект был добавлен.")
        }
        catch (error) {
            window.alert("Ошибка при добавлении объекта.")
        }
        finally {
            setIsLoading(false);
            handleOnClose();
        }
    }

    return (
      <Dialog open={open} onClose={handleOnClose}>
        <DialogTitle>{data ? `Редактирование объекта "${data.name}"` : "Создание объекта"}</DialogTitle>
        <DialogContent>
          <Container component="form" onSubmit={handleSubmit} id='BuildingForm' sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "6px"
            }}>
            <TextField
              required
              label="Название"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              fullWidth
              disabled={isLoading}
            />
            <TextField
              required
              label="Адрес"
              value={address}
              onChange={e => setAddress(e.target.value)}
              type="text"
              fullWidth
              disabled={isLoading}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Дата регистрации"
                value={dayjs(dateRegistration)}
                onChange={newDate => setDateRegistration(dayjs(newDate).isValid() ? dayjs(newDate).toDate() : new Date())}
                disabled={isLoading}
                />
            </LocalizationProvider>
            </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} disabled={isLoading}>Отмена</Button>
          <Button type="submit" form="BuildingForm" disabled={isLoading} loading={isLoading}>
            {data ? "Сохранить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default BuildingFormDialog;