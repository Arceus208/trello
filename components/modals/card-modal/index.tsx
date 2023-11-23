"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@prisma/client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activity";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal(
    (state) => state.isOpen
  );
  const onClose = useCardModal(
    (state) => state.onClose
  );

  const { data: cardData } =
    useQuery<CardWithList>({
      queryKey: ["card", id],
      queryFn: () => fetcher(`/api/cards/${id}`),
    });

  const { data: auditLogsData } = useQuery<
    AuditLog[]
  >({
    queryKey: ["card-logs", id],
    queryFn: () =>
      fetcher(`/api/cards/${id}/logs`),
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        {!cardData ? (
          <Header.Skeleton></Header.Skeleton>
        ) : (
          <Header data={cardData}></Header>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton></Description.Skeleton>
              ) : (
                <Description
                  data={cardData}
                ></Description>
              )}
              {!auditLogsData ? (
                <Activity.Skeleton></Activity.Skeleton>
              ) : (
                <Activity
                  items={auditLogsData}
                ></Activity>
              )}
            </div>
          </div>
          {!cardData ? (
            <Actions.Skeleton></Actions.Skeleton>
          ) : (
            <Actions data={cardData}></Actions>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
