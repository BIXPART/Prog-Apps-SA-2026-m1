import Botao from '@/componentes/Botao';
import { supabase } from '../lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

type SessaoType = {
    cod: string;
    uso: boolean;
    tipo: string;
    aluno_id?: number;
    codigo_id?: number;
};

export default function UseTicket() {
    const { sessao } = useLocalSearchParams<{ sessao: string }>();
    const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(sessao ? JSON.parse(sessao) : null);

    async function UsarTicket() {
        if (!SessaoObj) {
            Alert.alert('Você não tem um ticket para usar');
            return;
        }

        if (!SessaoObj.uso) {
            Alert.alert('Você não tem um ticket disponível');
            return;
        }

        // Atualiza no Supabase
        if (SessaoObj.tipo === 'matricula' && SessaoObj.aluno_id) {
            const { error } = await supabase
                .from('alunos')
                .update({ uso: false })
                .eq('id', SessaoObj.aluno_id);

            if (error) { Alert.alert('Erro ao usar ticket'); return; }
        }

        if (SessaoObj.tipo === 'cod' && SessaoObj.codigo_id) {
            const { error } = await supabase
                .from('codigo')
                .update({ uso: false })
                .eq('id', SessaoObj.codigo_id);

            if (error) { Alert.alert('Erro ao usar ticket'); return; }
        }

        SetSessaoObj({ ...SessaoObj, uso: false });
        Alert.alert('Ticket usado com sucesso!');
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50 }}>Usar Ticket</Text>
            <Text>Olá, {SessaoObj?.cod}</Text>
            <Text>Bem vindo!</Text>
            <Text>Status ticket: {SessaoObj?.uso ? 'Disponível' : 'Indisponível'}</Text>
            <Botao fala="Usar Ticket" funcao={UsarTicket} />
            <Botao fala="Voltar" funcao={() => router.push({ pathname: '/Home', params: { sessao: JSON.stringify(SessaoObj) } })} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
