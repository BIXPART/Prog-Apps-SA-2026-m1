import { useLocalSearchParams } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import Botao from '../componentes/Botao';

export default function UsarTicket() {

    const { Sessao } = useLocalSearchParams<{ Sessao: string }>();
    const SessaoObj = JSON.parse(Sessao);

    function UsarTicket() {
        if (SessaoObj.uso) {
            SessaoObj.uso = !SessaoObj
            Alert.alert("ticket usado com sucesso")
        } else {
            Alert.alert("Não foi possivel usar Ticket")

        }
    }

    return (
        <View>

            <Text>Olá {SessaoObj.cod}</Text>

            <Text>bem vindo</Text>

            <Text>Status ticket: {SessaoObj.uso}</Text>
            <Botao fala={'Usar Ticket'} funcao={() => { UsarTicket() }}></Botao>

        </View>
    )


}