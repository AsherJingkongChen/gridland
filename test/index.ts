import { db } from "../src/database";
import { Chunk_T1, Chunk_T2 } from './Chunk';

await db.delete();
await db.open();

await Chunk_T1();
await Chunk_T2();
