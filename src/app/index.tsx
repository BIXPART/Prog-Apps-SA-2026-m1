import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Botao from '../componentes/Botao';
import { supabase } from '../lib/supabase';

export default function Index() {
    const [CampoAl, SetCampoAl] = useState('');
    const [CampoADM, SetCampoADM] = useState('');
    const [ViwerADM, SetViwerADM] = useState<'none' | 'flex'>('none');
    const [ViwerEST, SetViwerEST] = useState<'none' | 'flex'>('flex');

    async function VerificarM_C() {
        // Busca na tabela matriculas
        const { data: matricula } = await supabase
            .from('matriculas')
            .select('id, valor')
            .eq('valor', CampoAl)
            .single();

        if (matricula) {
            // Busca o aluno vinculado à matrícula
            const { data: aluno } = await supabase
                .from('alunos')
                .select('id, nome, fk_matricula, uso')
                .eq('fk_matricula', matricula.id)
                .single();

            if (aluno) {
                const sessao = {
                    cod: matricula.valor,
                    uso: aluno.uso,
                    tipo: 'matricula',
                    aluno_id: aluno.id,
                };
                router.push({ pathname: '/Home', params: { sessao: JSON.stringify(sessao) } });
                return;
            }
        }

        // Busca na tabela codigo
        const { data: codigo } = await supabase
            .from('codigo')
            .select('id, valor, uso')
            .eq('valor', CampoAl)
            .single();

        if (codigo) {
            const sessao = {
                cod: codigo.valor,
                uso: codigo.uso ?? false,
                tipo: 'cod',
                codigo_id: codigo.id,
            };
            router.push({ pathname: '/Home', params: { sessao: JSON.stringify(sessao) } });
            return;
        }

        Alert.alert('Matrícula ou código inválido');
    }

    async function VerificarADM() {
        const { data: admin } = await supabase
            .from('admin')
            .select('id, valor')
            .eq('valor', CampoADM)
            .single();

        if (admin) {
            router.push({ pathname: '/Admin', params: { sessao: JSON.stringify({ cod: admin.valor, tipo: 'adm' }) } });
            return;
        }

        Alert.alert('Senha inválida');
    }

    function trocar() {
        if (ViwerADM === 'none') {
            SetViwerEST('none');
            SetViwerADM('flex');
        } else {
            SetViwerADM('none');
            SetViwerEST('flex');
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerEST }}>
                <Text style={{ fontSize: 50, margin: 30 }}>Login Aluno</Text>
                <TextInput
                    placeholder="matrícula ou código"
                    onChangeText={SetCampoAl}
                    style={{ backgroundColor: 'cyan', height: 50, width: 250, bottom: 15, borderRadius: 15 }}
                />
                <Botao fala="Verificar" funcao={VerificarM_C} />
                <Botao funcao={trocar} fala="trocar ADM" />
            </View>

            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerADM }}>
                <Text style={{ fontSize: 50, margin: 30 }}>Login Adm</Text>
                <TextInput
                    placeholder="SenhaADM"
                    onChangeText={SetCampoADM}
                    style={{ backgroundColor: 'cyan', height: 50, width: 250, bottom: 15, borderRadius: 15 }}
                />
                <Botao fala="Verificar" funcao={VerificarADM} />
                <Botao fala="trocar Aluno" funcao={trocar} />
            </View>
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
