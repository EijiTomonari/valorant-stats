import { Flex, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PlayerCard from '../components/home/playerCard'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>CUD | Valorant Stats</title>
        <meta name="description" content="Valorant tracker for CUD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading position={'fixed'} top={'2rem'} color={'red.500'}>CUD | Valorant Stats</Heading>
        <Flex flexDir={'row'}>
          <PlayerCard></PlayerCard>
        </Flex>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/EijiTomonari/valorant-stats"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed by Eiji Tomonari
        </a>
      </footer>
    </div>
  )
}

export default Home
