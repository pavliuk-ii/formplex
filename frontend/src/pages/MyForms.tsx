import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, List, ListItem, ListItemText, IconButton, Modal } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Delete, Publish, Unpublished } from '@mui/icons-material';

interface Form {
  id: number;
  title: string;
  updatedAt: string;
  isPublished: boolean;
}

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3333/forms')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setForms(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      })
      .catch(error => console.error('Error fetching forms:', error));
  }, []);

  const handleDelete = (formId: number) => {
    setOpenModal(true);
    setSelectedForm(formId);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:3333/forms/${selectedForm}`, { method: 'DELETE' })
      .then(() => {
        setForms(forms.filter((form: Form) => form.id !== selectedForm));
        setOpenModal(false);
        setSelectedForm(null);
      })
      .catch(error => console.error('Error deleting form:', error));
  };

  const handlePublish = (formId: number) => {
    fetch(`http://localhost:3333/forms/${formId}/publish`, { method: 'PATCH' })
      .then(() => {
        setForms(forms.map((form: Form) => form.id === formId ? { ...form, isPublished: !form.isPublished } : form));
      })
      .catch(error => console.error('Error publishing form:', error));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Мої форми</Typography>
      <Button variant="contained" color="primary" component={RouterLink} to="/create-form" sx={{ mb: 2 }}>
        Створити
      </Button>
      <List>
        {forms.sort((a: Form, b: Form) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((form: Form) => (
          <ListItem key={form.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText
              primary={form.title}
              secondary={`Востаннє відредаговано: ${new Date(form.updatedAt).toLocaleDateString()}`}
            />
            <Box>
              <IconButton onClick={() => handlePublish(form.id)}>
                {form.isPublished ? <Unpublished /> : <Publish />}
              </IconButton>
              <IconButton onClick={() => handleDelete(form.id)}>
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '4px', boxShadow: 24 }}>
          <Typography variant="h6">Видалити форму?</Typography>
          <Typography sx={{ mb: 2 }}>Ця дія не може бути скасована.</Typography>
          <Button variant="contained" color="primary" onClick={confirmDelete} sx={{ mr: 2 }}>
            Видалити
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setOpenModal(false)}>
            Скасувати
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyForms;
