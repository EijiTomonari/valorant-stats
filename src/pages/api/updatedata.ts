// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  query,
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { Player } from "../../components/home/playerCard";
import { fetchPlayers } from "../../util/databaseServices";
import { db } from "../../util/firebase";

type Data = {
  message: string;
};

type ValorantAPIResponse = {
  status: number;
  data: {
    currenttier: number;
    currenttierpatched: string;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name: string;
    tag: string;
    old: boolean;
  };
};

const fetchUpdatedData = async (player: Player) => {
  try {
    const response = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/mmr/na/${encodeURIComponent(
        player.riotid
      )}/${player.tag}`
    );
    const responseJson = await response.json();
    const data = responseJson as ValorantAPIResponse;
    return data;
  } catch (err) {
    console.error(err);
    return { status: 500, data: {} } as ValorantAPIResponse;
  }
};

const sendDataToFirebase = async (
  response: ValorantAPIResponse,
  docref: string
) => {
  // Only proceed if the response is valid
  if (response.status != 200) {
    return;
  }
  // Update the player's data
  const docRef = doc(db, "players", docref);
  await setDoc(
    docRef,
    {
      currentMMR: response.data.ranking_in_tier,
      elo: response.data.currenttier - 2,
    },
    { merge: true }
  )
    .then(() => console.log("Successfully updated player data " + docref))
    .catch((e) =>
      console.error("There was an error updating player data " + docref)
    );
  // Insert today's statistics into the player's history
  const today = new Date();
  const dateString =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  const statDocRef = doc(db, `eloprogress/${docref}/data`, dateString);
  await setDoc(
    statDocRef,
    {
      MMR: response.data.elo,
      eloname: response.data.currenttierpatched,
      elo: response.data.currenttier - 2,
      pdl: response.data.ranking_in_tier,
      timestamp: Timestamp.fromDate(today),
    },
    { merge: true }
  )
    .then(() => console.log("Successfully updated player statistics " + docref))
    .catch((e) =>
      console.error("There was an error updating player statistics " + docref)
    );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let players: Player[] = [];
  // Fetch all players from the database
  players = await fetchPlayers();
  // Fetch the data for each player and update the database
  players.forEach(async (player, index) => {
    const response = await fetchUpdatedData(player);
    const firebaseResponse = await sendDataToFirebase(response, player.docref);
    if (index == players.length - 1) {
      res.status(200).json({ message: "Successfully updated players data" });
    }
  });
}
