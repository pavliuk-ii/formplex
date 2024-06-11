import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Form {
  title: string;
  description: string;
  isPublished: boolean;
}

const EditForm: React.FC = () => {
  const { url } = useParams<{ url: string; }>();
  const [form, setForm] = useState<Form | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/forms/${url}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setForm(response.data);
      } catch (error) {
        console.error('Failed to fetch form', error);
        enqueueSnackbar('Помилка при завантаженні форми', { variant: 'error' });
      }
    };

    fetchForm();
  }, [url, enqueueSnackbar]);

  const handleChange = (field: keyof Form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (form) {
      const updatedForm = { ...form, [field]: event.target.value };
      setForm(updatedForm);
    }
  };

  const handleBlur = async (field: keyof Form) => {
    if (form) {
      try {
        await axios.patch(
          `http://localhost:3333/forms/${url}`,
          { [field]: form[field] },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } catch (error) {
        console.error('Failed to update form', error);
        enqueueSnackbar('Помилка при оновленні форми', { variant: 'error' });
      }
    }
  };

  const handlePublishToggle = async () => {
    if (form) {
      try {
        await axios.patch(
          `http://localhost:3333/forms/${url}/publish`,
          { isPublished: !form.isPublished },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setForm({ ...form, isPublished: !form.isPublished });
        enqueueSnackbar('Налаштування публікації змінено', { variant: 'success' });
      } catch (error) {
        console.error('Failed to update publication status', error);
        enqueueSnackbar('Помилка при зміні налаштувань публікації', { variant: 'error' });
      }
    }
  };

  if (!form) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ flex: 3, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Редагувати форму</Typography>
        <TextField
          label="Назва форми"
          value={form.title}
          onChange={handleChange('title')}
          onBlur={() => handleBlur('title')}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Опис форми"
          value={form.description}
          onChange={handleChange('description')}
          onBlur={() => handleBlur('description')}
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
        />
      </Box>
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishToggle}
          sx={{ mb: 2 }}
        >
          {form.isPublished ? 'Закрити доступ' : 'Опублікувати'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditForm;
