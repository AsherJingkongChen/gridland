import { db } from './database';
import { closeCanvas, openCanvas } from './script';

await db.delete(); // [TODO]
await db.open();

openCanvas({ worldid: 1 });

window.addEventListener('beforeunload', closeCanvas, {
  once: true
});
