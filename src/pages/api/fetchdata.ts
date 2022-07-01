// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query, collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Player } from '../../components/home/playerCard';
import { db } from '../../util/firebase'

type Data = {
  name: string
}

type ValorantAPIResponse = {
  status: number,
  data: {
    currenttier: number,
    currenttierpatched: string,
    ranking_in_tier: number,
    mmr_change_to_last_game: number,
    elo: number,
    name: string,
    tag: string,
    old: boolean
  }
}

const fetchPlayers = async () => {
  try {
    const q = query(collection(db, "players"));
    const doc = await getDocs(q);
    const data = doc.docs.map(d => d.data());
    return data as Player[];
  } catch (err) {
    console.error(err);
    alert("An error occured while fetching players");
    return [];
  }
}

const fetchUpdatedData = (player: Player) => {
  try {
    fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/na/${encodeURIComponent(player.riotid)}/${player.tag}`)
      .then(res => res.json()
        .then(async data => { if (data.status == 200) { await sendDataToFirebase(data as ValorantAPIResponse, player.docref) } }))
  } catch (err) {
    console.error(err)
  }
}

const sendDataToFirebase = async (response: ValorantAPIResponse, docref: string) => {
  if (response.status != 200) {
    return;
  }
  const docRef = doc(db, 'players', docref);
  await setDoc(docRef, {
    currentMMR: response.data.ranking_in_tier,
    elo: response.data.currenttier - 2
  }, { merge: true }).then(() => console.log("Successfully updated player data"));
  const today = new Date();
  const dateString = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
  const statDocRef = doc(db, `eloprogress/${docref}/data`, dateString);
  await setDoc(statDocRef, {
    MMR: response.data.elo,
    eloname: response.data.currenttierpatched,
    elo: response.data.currenttier - 2,
    pdl: response.data.ranking_in_tier,
    timestamp: Timestamp.fromDate(today)
  }, { merge: true }).then(() => console.log("Successfully updated player statistics"));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let players: Player[] = [];
  players = await fetchPlayers();
  players.forEach(player => {
    fetchUpdatedData(player);
  });
  res.status(200).json({ name: 'John Doe' })
}
