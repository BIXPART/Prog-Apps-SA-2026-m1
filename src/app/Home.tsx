import Botao from '@/componentes/Botao';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    const { sessao } = useLocalSearchParams<{ sessao: string }>();
    const SessaoObj = sessao ? JSON.parse(sessao) : null;

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50 }}>HOME</Text>
            <Text>Sessão atual: {SessaoObj?.cod}</Text>

            <Botao fala="Usar Ticket" funcao={() => router.push({ pathname: '/UseTicket', params: { sessao } })} />
            <Botao fala="Pegar Ticket" funcao={() => router.push({ pathname: '/GetTicket', params: { sessao } })} />
            <Botao fala="Sair" funcao={() => router.push('/')} />
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
    },
});
