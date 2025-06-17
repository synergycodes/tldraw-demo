import { ROOM_KEY } from "@/consts";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export function useSyncedRoomId(): string {
  return useMemo(() => {
    const url = new URL(window.location.href);
    const urlRoomId = url.searchParams.get(ROOM_KEY);
    const localRoomId = localStorage.getItem(ROOM_KEY);

    if (urlRoomId && !localRoomId) {
      localStorage.setItem(ROOM_KEY, urlRoomId);
      return urlRoomId;
    }

    if (!urlRoomId && localRoomId) {
      url.searchParams.set(ROOM_KEY, localRoomId);
      history.replaceState(null, "", url.toString());
      return localRoomId;
    }

    if (!urlRoomId && !localRoomId) {
      const newRoomId = uuidv4();
      localStorage.setItem(ROOM_KEY, newRoomId);
      url.searchParams.set(ROOM_KEY, newRoomId);
      history.replaceState(null, "", url.toString());
      return newRoomId;
    }

    return urlRoomId as string;
  }, []);
}
