"use client";

import {
  ElementRef,
  useRef,
  useState,
} from "react";
import {
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

type ListItemProps = {
  index: number;
  data: ListWithCards;
};

export const ListItem = ({
  index,
  data,
}: ListItemProps) => {
  const textareaRef =
    useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] =
    useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable
      draggableId={data.id}
      index={index}
    >
      {(provided) => (
        <li
          className="shrink-0 h-full w-[272px] select-none"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
            {...provided.dragHandleProps}
          >
            <ListHeader
              data={data}
              onAddCard={enableEditing}
            ></ListHeader>
            <Droppable
              droppableId={data.id}
              type="card"
            >
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0
                      ? "mt-2"
                      : "mt-0"
                  )}
                >
                  {data.cards.map(
                    (card, index) => (
                      <CardItem
                        index={index}
                        key={card.id}
                        data={card}
                      ></CardItem>
                    )
                  )}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              listId={data.id}
            ></CardForm>
          </div>
        </li>
      )}
    </Draggable>
  );
};
