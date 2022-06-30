import { Flex, Image } from "@chakra-ui/react"
import styles from './EloProgressBar.module.css'

type EloProps = {
    currentMMR: number,
    elo: number,
}

const EloProgressBar = ({ props }: { props: EloProps }) => {
    return (<Flex flexDir={'column'} marginTop={'-50px'} marginBottom={'30px'} zIndex={10} background={'linear-gradient(180deg, rgba(24,24,33,0) 0%, rgba(24,24,33,1) 50%)'}>
        <Image src={`images/elos/${props.elo}.png`} objectFit='cover' boxSize={'60px'} alignSelf={'center'}></Image>
        <div className={styles.progressbarborder}>
            <div className={styles.progressbarlevel} style={{ width: `${props.currentMMR * 0.95}%` }}></div>
            <h3><span>{`${props.currentMMR}`}</span> / 100</h3>
        </div>
    </Flex>)
}

export default EloProgressBar