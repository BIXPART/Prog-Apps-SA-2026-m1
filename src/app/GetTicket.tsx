import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Botao from '../componentes/Botao';

type SessaoType = {
    cod: string;
    uso: boolean;
    tipo: string;
}

export default function GetTicket() {

    const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(null);

    useEffect(() => {
        async function Receber_dados() {
            const Sessao = await AsyncStorage.getItem("SessaoAtual")
            if (Sessao) {
                const SessaoParse = JSON.parse(Sessao);
                SetSessaoObj(SessaoParse);
            }
        } Receber_dados();
    }, [])

    useEffect(() => {
        async function Atualizar_Sessao() {
            if (SessaoObj) {
                const SessaoString = JSON.stringify(SessaoObj);
                await AsyncStorage.setItem("Sessao", SessaoString);
            }
        } Atualizar_Sessao();
    })

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

        if (!SessaoObj?.cod) {
            (true);
            SetSessaoObj({
                cod: SessaoObj?.cod || "Desconecido",
                uso: true,
                tipo: SessaoObj?.tipo || "matricula",
            })
        } else {
            Alert.alert("Ticket já recebido");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50 }}>Pegar Ticket</Text>
            <Text>Sessão atual: {SessaoObj?.cod}</Text>
            <Text>Status ticket: {SessaoObj?.uso ? "Disponivel" : "Indisponivel"}</Text>
            <Text style={{ fontSize: 40 }}>{Horario}</Text>
            <Botao fala={'Receber Ticket'} funcao={Ticket} />
            <Botao fala={'Sair'} funcao={() => { router.push("/Home") }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
});