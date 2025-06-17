import type { RoomSnapshot } from "@tldraw/sync-core";
import { TLSocketRoom } from "@tldraw/sync-core";
import { mkdir, readFile, writeFile, rm } from "fs/promises";
import { join } from "path";
import {
  createTLSchema,
  defaultBindingSchemas,
  defaultShapeSchemas,
} from "tldraw";
import type {TLRecord} from 'tldraw'
import { defaultModel } from "./default-model";

async function safeRm(path: string): Promise<void> {
  try {
    await rm(path);
  } catch (e) {
    if (e instanceof Error && (e as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw e;
    }
  }
}

const DIR = "./.rooms";
async function readSnapshotIfExists(roomId: string) {
  try {
    const data = await readFile(join(DIR, roomId));
    return JSON.parse(data.toString()) ?? undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultModel;
  }
}
async function saveSnapshot(roomId: string, snapshot: RoomSnapshot) {
  await mkdir(DIR, { recursive: true });
  await writeFile(join(DIR, roomId), JSON.stringify(snapshot));
}

interface RoomState {
  room: TLSocketRoom<TLRecord, void>;
  id: string;
  needsPersist: boolean;
}
const rooms = new Map<string, RoomState>();

let mutex = Promise.resolve<null | Error>(null);

const schema = createTLSchema({
  shapes: {
    ...defaultShapeSchemas,
    "family-member": {},
  },
  bindings: defaultBindingSchemas,
});

export async function makeOrLoadRoom(roomId: string) {
  // eslint-disable-next-line no-console
  console.log(roomId);
  mutex = mutex
    .then(async () => {
      if (rooms.has(roomId)) {
        const roomState = await rooms.get(roomId)!;
        if (!roomState.room.isClosed()) {
          return null;
        }
      }
      // eslint-disable-next-line no-console
      console.log("loading room", roomId);
      const initialSnapshot = await readSnapshotIfExists(roomId);

      const roomState: RoomState = {
        needsPersist: false,
        id: roomId,
        room: new TLSocketRoom({
          schema,
          initialSnapshot,
          onSessionRemoved(room, args) {
            // eslint-disable-next-line no-console
            console.log("client disconnected", args.sessionId, roomId);
            if (args.numSessionsRemaining === 0) {
              // eslint-disable-next-line no-console
              console.log("closing room", roomId);
              room.close();
            }
          },
          onDataChange() {
            roomState.needsPersist = true;
          },
        }),
      };

      rooms.set(roomId, roomState);
      return null;
    })
    .catch((error) => {
      return error;
    });

  const err = await mutex;
  if (err) throw err;

  const state = rooms.get(roomId);
  if (!state || state.room.isClosed()) {
    throw new Error(`Room ${roomId} was unexpectedly removed`);
  }

  return state.room;
}

setInterval(() => {
 for (const roomState of rooms.values()) {
  if (roomState.needsPersist) {
    roomState.needsPersist = false;
    // eslint-disable-next-line no-console
    console.log("saving snapshot", roomState.id);
    saveSnapshot(roomState.id, roomState.room.getCurrentSnapshot());
  }
  if (roomState.room.isClosed()) {
    // eslint-disable-next-line no-console
    console.log("deleting room", roomState.id);
    rooms.delete(roomState.id);
    safeRm(join(DIR, roomState.id));
  }
}
}, 2000);
