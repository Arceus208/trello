"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import {
  ACTION,
  ENTITY_TYPE,
} from "@prisma/client";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-actions";
import { CopyList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (
  data: InputType
): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      include: { cards: true },
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList
      ? lastList.order + 1
      : 1;

    const cards = listToCopy.cards.map(
      (card) => ({
        title: card.title,
        description: card.description,
        order: card.order,
      })
    );

    if (listToCopy.cards.length !== 0) {
      list = await db.list.create({
        data: {
          boardId: listToCopy.boardId,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
          cards: {
            createMany: {
              data: listToCopy.cards.map(
                (card) => ({
                  title: card.title,
                  description: card.description,
                  order: card.order,
                })
              ),
            },
          },
        },
        include: {
          cards: true,
        },
      });
    } else {
      list = await db.list.create({
        data: {
          boardId: listToCopy.boardId,
          title: `${listToCopy.title} - Copy`,
          order: newOrder,
        },
        include: {
          cards: true,
        },
      });
    }

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(
  CopyList,
  handler
);
