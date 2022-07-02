import {
  Button,
  CircularProgress,
  Flex,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { getDocs, query, collection, orderBy } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import LineChart from "../components/home/linesChart";
import PlayerCard, { Player } from "../components/home/playerCard";
import styles from "../styles/Home.module.css";
import { db } from "../util/firebase";
import { BiRefresh } from "react-icons/bi";

const Home: NextPage = () => {
  const [loadingplayers, setloadingplayers] = useState<boolean>(false);
  const [loadingstatistics, setloadingstatistics] = useState<boolean>(false);
  const [players, setplayers] = useState<Player[]>([]);
  const [playersstatistics, setplayersstatistics] = useState<any>([]);

  const fetchPlayers = async () => {
    setloadingplayers(true);
    setloadingstatistics(true);
    try {
      const q = query(collection(db, "players"));
      const doc = await getDocs(q);
      const data = doc.docs.map((d) => d.data());
      setplayers(data as Player[]);
      setloadingplayers(false);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching players");
    }
  };

  const updatePlayersData = async () => {
    setloadingplayers(true);
    setloadingstatistics(true);
    setplayers([]);
    setplayersstatistics([]);
    try {
      fetch("/api/updatedata");
    } catch (err) {
      console.error(err);
    }
    fetchPlayers();
  };

  const fetchPlayerStatistics = async (player: Player) => {
    // Generate a random color code
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
      const x = doc.data().timestamp.toDate().toLocaleDateString("pt-BR");
      const y = doc.data().MMR;
      const eloname = doc.data().eloname;
      const pdl = doc.data().pdl;
      playerStatistics.data.push({ x: x, y: y, eloname: eloname, pdl: pdl });
    });
    // Add the player statistics to the state
    setplayersstatistics((prev: any) => [...prev, playerStatistics]);
    setloadingstatistics(false);
  };

  useEffect(() => {
    setloadingstatistics(true);
    try {
      let statistics = [];
      players.forEach((player) => {
        fetchPlayerStatistics(player);
      });
    } catch (error) {
      console.error(error);
    }
  }, [players]);

  useEffect(() => {
    if (loadingplayers) return;
    fetchPlayers();
  }, []);

  console.log(playersstatistics);
  return (
    <div className={styles.container}>
      <Head>
        <title>CUD | Valorant Stats</title>
        <meta name="description" content="Valorant tracker for CUD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading mb={"1rem"} color={"red.500"}>
          CUD | Valorant Stats
        </Heading>
        <Flex
          flexDir={"row"}
          w={"100%"}
          overflowX={"auto"}
          justifyContent={"center"}
        >
          {players &&
            !loadingplayers &&
            players.map((player) => (
              <PlayerCard key={player.name} player={player} />
            ))}
          {loadingplayers && (
            <CircularProgress isIndeterminate color="red"></CircularProgress>
          )}
        </Flex>
        <Flex justifyContent={"center"} w={"75%"} mt={"5rem"}>
          {playersstatistics && !loadingstatistics && (
            <LineChart statistics={playersstatistics}></LineChart>
          )}
          {loadingstatistics && (
            <CircularProgress isIndeterminate color="red"></CircularProgress>
          )}
        </Flex>
        <Button
          onClick={() => updatePlayersData()}
          leftIcon={<Icon as={BiRefresh} />}
          colorScheme="green"
          variant="solid"
        >
          Refresh Data
        </Button>
      </main>
    </div>
  );
};

export default Home;
