import { Button, Flex, Heading } from '@chakra-ui/react'
import { getDocs, query, collection } from 'firebase/firestore'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PlayerCard, { Player } from '../components/home/playerCard'
import styles from '../styles/Home.module.css'
import { db } from '../util/firebase'

const Home: NextPage = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [players, setplayers] = useState<Player[]>([]);

  const fetchPlayers = async () => {
    setloading(true);
    try {
      const q = query(collection(db, "players"));
      const doc = await getDocs(q);
      const data = doc.docs.map(d => d.data());
      setplayers(data as Player[]);
      console.log(players)
      setloading(false);


    } catch (err) {
      console.error(err);
      alert("An error occured while fetching players");
    }
  }

  const updatePlayersData = async () => {
    try {
      fetch('/api/fetchdata');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (loading) return;
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
        <Heading position={'fixed'} top={'5rem'} color={'red.500'}>CUD | Valorant Stats</Heading>
        <Flex flexDir={'row'} w={'100%'} overflowX={'auto'} justifyContent={'center'}>
          {players && players.map(player => <PlayerCard key={player.name} player={player} />)}
        </Flex>
        <Button onClick={() => updatePlayersData()}>Test</Button>
      </main>
    </div>
  )
}

export default Home
