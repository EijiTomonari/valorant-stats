import { Button, CircularProgress, Flex, Heading } from "@chakra-ui/react";
import { getDocs, query, collection } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import LineChart from "../components/home/linesChart";
import PlayerCard, { Player } from "../components/home/playerCard";
import styles from "../styles/Home.module.css";
import { db } from "../util/firebase";

const Home: NextPage = () => {
  const [loadingplayers, setloadingplayers] = useState<boolean>(false);
  const [loadingstatistics, setloadingstatistics] = useState<boolean>(false);
  const [players, setplayers] = useState<Player[]>([]);

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
    try {
      fetch("/api/fetchdata");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loadingplayers) return;
    fetchPlayers();
  }, []);

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
          <LineChart></LineChart>
        </Flex>
        <Button onClick={() => updatePlayersData()}>Test</Button>
      </main>
    </div>
  );
};

export default Home;
