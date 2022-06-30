import { Flex, Heading, Image } from "@chakra-ui/react"
import EloProgressBar from "./eloProgressBar"

const PlayerCard = () => {
    return (
        <Flex flexDir={'column'} background={'#181821'} borderRadius={'10px'} p={0} textAlign={'center'} pb={3}>
            <Image src={'images/agentsBGs/chamber.png'} borderTopRadius={'10px'} alt={'player'} objectFit='cover' boxSize={'300px'} position={'absolute'} boxShadow={'inset 0px -34px 25px -11px #181821'} />
            <Image src={"images/playerProfilePhoto.png"} borderTopRadius={'10px'} objectFit="contain" boxSize={"300px"} filter={'grayscale(100%)'} boxShadow={'inset 0px -34px 50px 16px #181821'}></Image>
            <EloProgressBar props={{
                currentMMR: 13,
                elo: 14
            }}></EloProgressBar>
            <Heading color={'white'} size={'lg'}>Ber</Heading>
            <Heading color={'#2c2c3b'} size={'md'}>CUD tio</Heading>

        </Flex>
    )
}

export default PlayerCard