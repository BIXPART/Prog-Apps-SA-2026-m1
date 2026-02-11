import { View, Text, StyleSheet } from 'react-native';
import Botao from '@/componentes/Botao';
import { router, useLocalSearchParams } from 'expo-router';

export default function Home() {

    const { Sessao } = useLocalSearchParams<{ Sessao: string }>();

    const SessaoObj = JSON.parse(Sessao);



    return (
        <View style={styles.container}>
            <Text>Olá {SessaoObj.nome}</Text>

            <Botao fala={'Usar Ticket'} funcao={() => {
                router.push({
                    pathname: "/UsarTicket",
                    params: {
                        Sessao: JSON.stringify({
                            tipo: "matricula",
                            cod: SessaoObj.cod,
                            uso: SessaoObj.uso
                        })
                    }
                })
            }} />
            <Botao fala={'Pegar Ticket'} funcao={() => {
                router.push({
                    pathname: "/GetTicket",
                    params: {
                        Sessao: JSON.stringify({
                            tipo: "matricula",
                            cod: SessaoObj.cod,
                            uso: SessaoObj.uso
                        })
                    }
                })
            }
            } />

            <Botao fala={'Sair'} funcao={() => {
                router.push({
                    pathname: "/",
                    params: {
                        Sessao: JSON.stringify({
                            tipo: "matricula",
                            cod: SessaoObj.cod,
                            uso: SessaoObj.uso
                        })
                    }
                })
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flexDirection: 'column',
    }
});