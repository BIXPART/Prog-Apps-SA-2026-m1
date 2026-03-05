import Botao from '@/componentes/Botao'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SessaoType = {
    id?: number
    cod: string
    uso: boolean
    tipo: string
}

export default function Home() {

    const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(null)

    useEffect(() => {

        async function Receber_dados() {

            const Sessao = await AsyncStorage.getItem("SessaoAtual")

            if (Sessao) {
                SetSessaoObj(JSON.parse(Sessao))
            }

        }

        Receber_dados()

    }, [])


    return (
        <View style={styles.container}>

            <Text style={{ fontSize: 50 }}>HOME</Text>

            <Text>Sessão atual {SessaoObj?.cod}</Text>

            <Botao
                fala={'Usar Ticket'}
                funcao={() => router.push("/UseTicket")}
            />

            <Botao
                fala={'Pegar Ticket'}
                funcao={() => router.push("/GetTicket")}
            />

            <Botao
                fala={'Sair'}
                funcao={() => router.push("/")}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flexDirection: 'column',
    }
})