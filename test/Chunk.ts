import { Chunk } from '../src/database';

export const Chunk_T1 = async () => {
  console.log('Chunk: Read, Create, Read');

  let read = await Chunk.Read({ worldid: 1, x: -2, y: 3 });
  console.assert(read === undefined);

  let create = await Chunk.Create({ worldid: 1, x: -2, y: 3 });
  console.assert(create.worldid === 1);
  console.assert(create.x === -2);
  console.assert(create.y === 3);

  read = await Chunk.Read({ worldid: 1, x: -2, y: 3 });
  console.assert(read !== undefined);
  console.assert(read?.worldid === 1);
  console.assert(read?.x === -2);
  console.assert(read?.y === 3);
};

export const Chunk_T2 = async () => {
  console.log('Chunk: Create, Read, Delete, Read');

  let create = await Chunk.Create({ worldid: 2, x: 1, y: 0 });
  console.assert(create.worldid === 2);
  console.assert(create.x === 1);
  console.assert(create.y === 0);

  let read = await Chunk.Read({ worldid: 2, x: 1, y: 0 });
  console.assert(read !== undefined);
  console.assert(read?.worldid === 2);
  console.assert(read?.x === 1);
  console.assert(read?.y === 0);

  await Chunk.Delete({ worldid: 2, x: 1, y: 0 });

  read = await Chunk.Read({ worldid: 2, x: 1, y: 0 });
  console.assert(read === undefined);
};
