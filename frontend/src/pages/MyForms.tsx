import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

interface Form {
  id: number;
  title: string;
  updatedAt: string;
  url: string;
  isPublished: boolean;
}

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const response = await axios.get('http://localhost:3333/forms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setForms(response.data);
    };

    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    try {
      // Створення форми
      const formResponse = await axios.post(
        'http://localhost:3333/forms',
        { title: 'Нова форма', description: '', isAnonymous: true },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const formUrl = formResponse.data.url;

      const questionResponse = await axios.post(
        `http://localhost:3333/forms/${formUrl}/questions`,
        { text: 'Текст запитання 1', type: 'RADIOBUTTON', isRequired: false },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const questionId = questionResponse.data.id;

      await axios.post(
        `http://localhost:3333/forms/${formUrl}/questions/${questionId}/options`,
        { text: 'Варіант 1' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      navigate(`/edit-form/${formUrl}`);
    } catch (error) {
      console.error('Failed to create form', error);
      enqueueSnackbar('Помилка при створенні форми', { variant: 'error' });
    }
  };


  const handleTogglePublish = async (formUrl: string, isPublished: boolean) => {
    try {
      await axios.patch(
        `http://localhost:3333/forms/${formUrl}/publish`,
        { isPublished },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      setForms(forms.map(form => form.url === formUrl ? { ...form, isPublished } : form));
      enqueueSnackbar('Налаштування публікації змінено', { variant: 'success' });
    } catch (error) {
      console.error('Failed to update publication status', error);
      enqueueSnackbar('Помилка при зміні налаштувань публікації', { variant: 'error' });
    }
  };

  const handleDeleteClick = (form: Form) => {
    setSelectedForm(form);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedForm) {
      try {
        await axios.delete(`http://localhost:3333/forms/${selectedForm.url}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setForms(forms.filter(form => form.url !== selectedForm.url));
        enqueueSnackbar('Форму видалено', { variant: 'success' });
      } catch (error) {
        console.error('Failed to delete form', error);
        enqueueSnackbar('Помилка при видаленні форми', { variant: 'error' });
      }
      setIsDeleteDialogOpen(false);
      setSelectedForm(null);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Мої форми</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateForm}>
          Створити нову форму
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell>Назва форми</TableCell>
              <TableCell>Дата останнього редагування</TableCell>
              <TableCell>Опубліковано</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell onClick={() => navigate(`/edit-form/${form.url}`)}>{form.title.length > 50 ? form.title.substring(0, 50) + '...' : form.title}</TableCell>
                <TableCell onClick={() => navigate(`/edit-form/${form.url}`)}>{new Date(form.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Switch
                    checked={form.isPublished}
                    onChange={(e) => handleTogglePublish(form.url, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteClick(form)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Видалити форму</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Ви впевнені, що хочете видалити форму "{selectedForm?.title}"? Цю дію не можна буде скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyForms;
