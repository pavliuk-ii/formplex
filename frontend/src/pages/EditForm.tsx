import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, IconButton, Switch, Divider } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Delete as DeleteIcon, Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: string;
  options: Option[];
  isRequired: boolean;
}

interface Form {
  title: string;
  description: string;
  isPublished: boolean;
  isAnonymous: boolean;
  questions: Question[];
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  const handleFieldChange = async (field: string, value: string | boolean) => {
    if (form) {
      const updatedForm = { ...form, [field]: value };
      setForm(updatedForm);
      try {
        await axios.patch(
          `http://localhost:3333/forms/${url}`,
          { [field]: value },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } catch (error) {
        console.error(`Failed to update form ${field}`, error);
        enqueueSnackbar(`Помилка при оновленні ${field}`, { variant: 'error' });
      }
    }
  };

  const handlePublishToggle = async () => {
    if (!form) return;

    try {
      await axios.patch(
        `http://localhost:3333/forms/${url}/publish`,
        { isPublished: !form.isPublished },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setForm({
        ...form,
        isPublished: !form.isPublished,
        title: form.title || '',
        description: form.description || '',
        questions: form.questions || [],
        isAnonymous: form.isAnonymous || false,
      });
      enqueueSnackbar('Налаштування публікації змінено', { variant: 'success' });
    } catch (error) {
      console.error('Failed to update publication status', error);
      enqueueSnackbar('Помилка при зміні налаштувань публікації', { variant: 'error' });
    }
  };

  const handleQuestionChange = async (questionId: number, field: string, value: string) => {
    if (form) {
      const updatedQuestions = form.questions.map((question) =>
        question.id === questionId ? { ...question, [field]: value } : question
      );
      setForm({ ...form, questions: updatedQuestions });
      try {
        await axios.patch(
          `http://localhost:3333/forms/${url}/questions/${questionId}`,
          { [field]: value },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } catch (error) {
        console.error(`Failed to update question ${field}`, error);
        enqueueSnackbar(`Помилка при оновленні запитання ${field}`, { variant: 'error' });
      }
    }
  };

  const handleOptionChange = async (questionId: number, optionId: number, value: string) => {
    if (form) {
      const updatedQuestions = form.questions.map((question) =>
        question.id === questionId
          ? {
            ...question,
            options: question.options.map((option) =>
              option.id === optionId ? { ...option, text: value } : option
            ),
          }
          : question
      );
      setForm({ ...form, questions: updatedQuestions });
      try {
        await axios.patch(
          `http://localhost:3333/forms/${url}/questions/${questionId}/options/${optionId}`,
          { text: value },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } catch (error) {
        console.error('Failed to update option', error);
        enqueueSnackbar('Помилка при оновленні варіанту', { variant: 'error' });
      }
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3333/forms/${url}/questions`,
        { text: 'Текст запитання', type: 'RADIOBUTTON', isRequired: false },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setForm(prevForm => {
        if (!prevForm) return prevForm;
        return {
          ...prevForm,
          questions: [
            ...prevForm.questions,
            {
              ...response.data,
              options: [],
            },
          ],
        };
      });
    } catch (error) {
      console.error('Failed to add question', error);
      enqueueSnackbar('Помилка при додаванні запитання', { variant: 'error' });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await axios.delete(
        `http://localhost:3333/forms/${url}/questions/${questionId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setForm(prevForm => {
        if (!prevForm) return prevForm;
        return {
          ...prevForm,
          questions: prevForm.questions.filter(q => q.id !== questionId),
        };
      });
      enqueueSnackbar('Запитання видалено', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete question', error);
      enqueueSnackbar('Помилка при видаленні запитання', { variant: 'error' });
    }
  };

  const handleToggleRequired = async (questionId: number, isRequired: boolean) => {
    try {
      await axios.patch(
        `http://localhost:3333/forms/${url}/questions/${questionId}`,
        { isRequired },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setForm(prevForm => {
        if (!prevForm) return prevForm;
        return {
          ...prevForm,
          questions: prevForm.questions.map(q => q.id === questionId ? { ...q, isRequired } : q),
        };
      });
    } catch (error) {
      console.error('Failed to update question required status', error);
      enqueueSnackbar('Помилка при зміні налаштувань обов\'язковості', { variant: 'error' });
    }
  };

  const handleAddOption = async (questionId: number) => {
    if (form) {
      try {
        const response = await axios.post(
          `http://localhost:3333/forms/${url}/questions/${questionId}/options`,
          { text: 'Варіант 1' },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const updatedQuestions = form.questions.map((question) =>
          question.id === questionId ? { ...question, options: [...question.options, response.data] } : question
        );
        setForm({ ...form, questions: updatedQuestions });
      } catch (error) {
        console.error('Failed to add option', error);
        enqueueSnackbar('Помилка при додаванні варіанту', { variant: 'error' });
      }
    }
  };

  const handleDeleteOption = async (questionId: number, optionId: number) => {
    if (form) {
      try {
        await axios.delete(
          `http://localhost:3333/forms/${url}/questions/${questionId}/options/${optionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const updatedQuestions = form.questions.map((question) =>
          question.id === questionId
            ? { ...question, options: question.options.filter((option) => option.id !== optionId) }
            : question
        );
        setForm({ ...form, questions: updatedQuestions });
      } catch (error) {
        console.error('Failed to delete option', error);
        enqueueSnackbar('Помилка при видаленні варіанту', { variant: 'error' });
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
          onChange={(e) => handleFieldChange('title', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Опис форми"
          value={form.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <Divider sx={{ my: 4 }} />
        {form.questions.map((question, index) => (
          <Box key={question.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px', position: 'relative' }}>
            <Typography sx={{ position: 'absolute', top: 30, left: -30, color: 'gray' }}>{index + 1}.</Typography>
            <TextField
              label="Текст запитання"
              value={question.text}
              onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Select
              value={question.type}
              onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="RADIOBUTTON">Радіокнопка</MenuItem>
              <MenuItem value="CHECKBOX">Чекбокс</MenuItem>
              <MenuItem value="SHORT_ANSWER">Коротка відповідь</MenuItem>
              <MenuItem value="PARAGRAPH">Абзац</MenuItem>
              <MenuItem value="LINIAR_SCALE">Лінійна шкала</MenuItem>
              <MenuItem value="CHOICE_GRID">Сітка вибору</MenuItem>
              <MenuItem value="CHECKBOX_GRID">Сітка чекбоксів</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider sx={{ mb: 2, width: '80%' }} />
            </Box>
            {question.options.map((option) => (
              <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  value={option.text}
                  onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={() => handleDeleteOption(question.id, option.id)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddOption(question.id)}
              startIcon={<AddIcon />}
              sx={{ mt: 2, display: 'flex', justifyContent: 'center', margin: '0 auto' }}
            >
              Додати варіант
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>Обов'язкове</Typography>
                <Switch
                  checked={question.isRequired}
                  onChange={(e) => handleToggleRequired(question.id, e.target.checked)}
                />
                <IconButton
                  color="error"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>


          </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: '64px' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddQuestion}
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
        >
          Додати запитання
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishToggle}
          sx={{ mb: 2, width: '100%' }}
        >
          {form.isPublished ? 'Закрити доступ' : 'Опублікувати'}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>Вимагати вхід в акаунт для проходження</Typography>
          <Switch
            checked={!form.isAnonymous}
            onChange={(e) => handleFieldChange('isAnonymous', !e.target.checked)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EditForm;
