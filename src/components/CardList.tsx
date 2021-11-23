/* eslint-disable react/jsx-no-bind */
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentImage, setCurrentImage] = useState('');

  function handleSelectViewImage(url: string): void {
    onOpen();
    setCurrentImage(url);
  }

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleSelectViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={currentImage} />
    </>
  );
}
