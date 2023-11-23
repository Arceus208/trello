"use client";

import { Plus, X } from "lucide-react";
import {
  ElementRef,
  useRef,
  useState,
} from "react";
import {
  useEventListener,
  useOnClickOutside,
} from "usehooks-ts";
import {
  useParams,
  useRouter,
} from "next/navigation";

import { ListWrapper } from "./list-wrapper";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";
import { table } from "console";

export const ListForm = () => {
  const params = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] =
    useState(false);

  const formRef =
    useRef<ElementRef<"form">>(null);
  const inputRef =
    useRef<ElementRef<"input">>(null);

  const { execute, fieldErrors } = useAction(
    createList,
    {
      onSuccess: (data) => {
        toast.success(
          `List "${data.title}" created`
        );
        disableEditing();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get(
      "boardId"
    ) as string;

    execute({ title, boardId });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            errors={fieldErrors}
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
          ></FormInput>
          <input
            hidden
            value={params.boardId}
            name="boardId"
            readOnly
          ></input>
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              <X className="h-5 w-5"></X>
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
        onClick={enableEditing}
      >
        <Plus className="h-4 w-4 mr-2"></Plus>
        Add a list
      </button>
    </ListWrapper>
  );
};
