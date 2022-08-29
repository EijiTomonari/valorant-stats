import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { Player } from "../components/home/playerCard";
import { db } from "../util/firebase";

const fetchPlayers = async () => {
  try {
    const q = query(collection(db, "players"));
    const doc = await getDocs(q);
    const data = doc.docs.map((d) => d.data());
    return data as Player[];
  } catch (err) {
    console.error(err);
    return []; // return empty array if error
  }
};

const fetchPlayerStatistics = async (player: Player) => {
  // Generate a random color code
  let randomColor = "fffff";
  while (randomColor.length == 5) {
    randomColor = Math.floor(Math.random() * 16777215).toString(16);
  }
  // Create an empty object to store the player statistics
  let playerStatistics: any = {
    label: player.name,
    data: [],
    backgroundColor: `#${randomColor}`,
    borderColor: `#${randomColor}`,
  };
  // Fetch the player statistics from firebase
  const q = query(
    collection(db, `eloprogress/${player.docref}/data`),
    orderBy("timestamp", "asc")
  );
  const querySnapshot = await getDocs(q);
  // Transform each document into an data point object
  querySnapshot.forEach((doc) => {
    const x = doc
      .data()
      .timestamp.toDate()
      .toLocaleDateString("pt-BR")
      .slice(0, 5);
    const y = doc.data().MMR;
    const eloname = doc.data().eloname;
    const pdl = doc.data().pdl;
    playerStatistics.data.push({ x: x, y: y, eloname: eloname, pdl: pdl });
  });
  // Add the player statistics to the state
  return playerStatistics;
};

export { fetchPlayers, fetchPlayerStatistics };
