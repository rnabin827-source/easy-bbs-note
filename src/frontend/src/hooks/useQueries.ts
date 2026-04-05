import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../backend";
import { useActor } from "./useActor";

export function useGetNotes(year: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes", year],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes(year);
    },
    enabled: !!actor && !isFetching,
  });
}

export interface AddNoteInput {
  title: string;
  subject: string;
  year: string;
  content: string;
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddNoteInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addNote(
        input.title,
        input.subject,
        input.year,
        input.content,
      );
    },
    onSuccess: () => {
      // Invalidate all note queries so they refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
