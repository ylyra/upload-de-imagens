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
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();
  // TODO SELECTED IMAGE URL STATE
  const [currentImage, setCurrentImage] = useState('');

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleSelectViewImage(url: string): void {
    onOpen();
    setCurrentImage(url);
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleSelectViewImage} />
        ))}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={currentImage} />
    </>
  );
}
