import { Flex, Heading, Image } from "@chakra-ui/react"
import EloProgressBar from "./eloProgressBar"

export type Player = {
    currentMMR: number,
    elo: number,
    maincharacter: string,
    name: string,
    pictureurl: string,
    riotid: string,
    tag: string,
    docref: string,
}

const PlayerCard = ({ player }: { player: Player }) => {
    return (
        <Flex flexDir={'column'} background={'#181821'} borderRadius={'10px'} p={0} textAlign={'center'} pb={3} mx={'1rem'} w={'300px'} position={'relative'}>
            <Image src={`images/agentsBGs/${player.maincharacter}.png`} borderTopRadius={'10px'} alt={'player'} objectFit='cover' boxSize={'280px'} position={'absolute'} boxShadow={'inset 0px -34px 25px -11px #181821'} />
            <Image src={player.pictureurl} borderTopRadius={'10px'} objectFit="cover" boxSize={"300px"} filter={'grayscale(100%)'} boxShadow={'inset 0px -34px 50px 16px #181821'}></Image>
            <EloProgressBar props={{
                currentMMR: player.currentMMR,
                elo: player.elo
            }}></EloProgressBar>
            <Heading color={'white'} size={'lg'}>{player.name}</Heading>
            <Heading color={'#2c2c3b'} size={'md'}>{player.riotid + ' #' + player.tag}</Heading>

        </Flex>
    )
}

export default PlayerCard