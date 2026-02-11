import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Botao from '../componentes/Botao';
import { router, useLocalSearchParams } from 'expo-router';

export default function GetTicket() {

    const params = useLocalSearchParams();

    const rawSessao = Array.isArray(params.Sessao)
        ? params.Sessao[0]
        : params.Sessao;

    const SessaoObj = rawSessao ? JSON.parse(rawSessao) : null;

    const [Horario, SetHorario] = useState("");

    useEffect(() => {
        const intervalo = setInterval(() => {
            const agora = new Date();
            const horas = agora.getHours();
            const minutos = agora.getMinutes();

            SetHorario(`${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    function Ticket() {
        const agora = new Date();
        const horas = agora.getHours();
        const minutos = agora.getMinutes();

        const minutoAtual = horas * 60 + minutos;
        const inicioRecreio = 9 * 60 + 35;
        const fimRecreio = 9 * 60 + 55;

        if (minutoAtual < inicioRecreio) {
            Alert.alert("Não está na Hora do Seu Recreio ainda");
            return;
        }

        if (minutoAtual > fimRecreio) {
            Alert.alert("O seu recreio já passou");
            return;
        }

        if (!SessaoObj.uso) {
            (true);
            Alert.alert("Ticket Recebido");
        } else {
            Alert.alert("Ticket já recebido");
        }
    }

    return (
        <View style={styles.container}>
            <Text>Olá {SessaoObj.cod}</Text>
            <Text>Status ticket: {SessaoObj.uso ? "Sim" : "Não"}</Text>
            <Text style={{ fontSize: 40 }}>{Horario}</Text>
            <Botao fala={'Receber Ticket'} funcao={Ticket} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
