import type { Game } from "@/types/game";
import gamesJson from "./games.json";

/**
 * Full game catalog sourced from IGDB via fetchGames.js.
 * To refresh the data: IGDB_CLIENT_ID=x IGDB_CLIENT_SECRET=y node fetchGames.js
 */
export const games = gamesJson as unknown as Game[];

export default games;
