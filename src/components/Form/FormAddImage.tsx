import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface NewImageData {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormats =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: 'O campo de imagem é obrigatório',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'A imagem deve ser menor que 10MB',
        acceptedFormats: fileList =>
          acceptedFormats.test(fileList[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'O campo de título é obrigatório',
      minLength: {
        value: 2,
        message: 'É necessário ter ao menos 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'É necessário ter no máximo 20 caracteres',
      },
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'O campo de descrição é obrigatório',
      maxLength: {
        value: 65,
        message: 'É necessário ter no máximo 60 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: NewImageData) => {
      await api.post('/api/images', {
        ...image,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: NewImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description:
            'É necessário adicionar uma imagem e aguarda o upload ser completado',
        });
        return;
      }

      await mutation.mutateAsync(data);
      toast({
        status: 'success',
        title: 'Imagem adicionada',
        description: 'Sua imagem foi adicionada com success.',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Falha ao cadastar a imagem',
        description: 'Ocorreu um erro ao tenta cadastar a sua imagem',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
