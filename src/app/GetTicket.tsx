import Botao from '@/componentes/Botao';
import { supabase } from '../lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

type SessaoType = {
    cod: string;
    uso: boolean;
    tipo: string;
    aluno_id?: number;
    codigo_id?: number;
};

export default function GetTicket() {
    const { sessao } = useLocalSearchParams<{ sessao: string }>();
    const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(sessao ? JSON.parse(sessao) : null);
    const [Horario, SetHorario] = useState('');

    useEffect(() => {
        const intervalo = setInterval(() => {
            const agora = new Date();
            SetHorario(
                `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
            );
        }, 1000);
        return () => clearInterval(intervalo);
    }, []);

    async function Ticket() {
        const agora = new Date();
        const minutoAtual = agora.getHours() * 60 + agora.getMinutes();
        const inicioRecreio = 9 * 60 + 35;
        const fimRecreio = 9 * 60 + 55;

        if (minutoAtual < inicioRecreio) {
            Alert.alert('Não está na hora do seu recreio ainda');
            return;
        }
        if (minutoAtual > fimRecreio) {
            Alert.alert('O seu recreio já passou');
            return;
        }

        if (!SessaoObj) return;

        if (SessaoObj.uso) {
            Alert.alert('Ticket já recebido');
            return;
        }

        // Atualiza no Supabase conforme o tipo
        if (SessaoObj.tipo === 'matricula' && SessaoObj.aluno_id) {
            const { error } = await supabase
                .from('alunos')
                .update({ uso: true })
                .eq('id', SessaoObj.aluno_id);

            if (error) { Alert.alert('Erro ao pegar ticket'); return; }
        }

        if (SessaoObj.tipo === 'cod' && SessaoObj.codigo_id) {
            const { error } = await supabase
                .from('codigo')
                .update({ uso: true })
                .eq('id', SessaoObj.codigo_id);

            if (error) { Alert.alert('Erro ao pegar ticket'); return; }
        }

        const novaSessao = { ...SessaoObj, uso: true };
        SetSessaoObj(novaSessao);
        Alert.alert('Ticket recebido com sucesso!');
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50 }}>Pegar Ticket</Text>
            <Text>Sessão atual: {SessaoObj?.cod}</Text>
            <Text>Status ticket: {SessaoObj?.uso ? 'Disponível' : 'Indisponível'}</Text>
            <Text style={{ fontSize: 40 }}>{Horario}</Text>
            <Botao fala="Receber Ticket" funcao={Ticket} />
            <Botao fala="Sair" funcao={() => router.push({ pathname: '/Home', params: { sessao: JSON.stringify(SessaoObj) } })} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
});
