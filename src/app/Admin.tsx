import Botao from '@/componentes/Botao';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type AlunoType = { id: number; nome: string; fk_matricula: number; uso: boolean };
type CodigoType = { id: number; valor: string; uso: boolean | null };
type AdminType = { id: number; valor: string };
type MatriculaType = { id: number; valor: string };

export default function Admin() {
    const [Alunos, SetAlunos] = useState<AlunoType[]>([]);
    const [Codigos, SetCodigos] = useState<CodigoType[]>([]);
    const [Admins, SetAdmins] = useState<AdminType[]>([]);
    const [Matriculas, SetMatriculas] = useState<MatriculaType[]>([]);

    const [tela, setTela] = useState<'hub' | 'ver' | 'buscar' | 'editar'>('hub');

    // Campos de edição
    const [campTabela, SetCampTabela] = useState('');
    const [campId, SetCampId] = useState<number>(0);
    const [campValor, SetCampValor] = useState('');
    const [campUso, SetCampUso] = useState(false);
    const [campNome, SetCampNome] = useState('');

    useEffect(() => {
        carregarTudo();
    }, []);

    async function carregarTudo() {
        const [{ data: alunos }, { data: codigos }, { data: admins }, { data: matriculas }] = await Promise.all([
            supabase.from('alunos').select('*'),
            supabase.from('codigo').select('*'),
            supabase.from('admin').select('*'),
            supabase.from('matriculas').select('*'),
        ]);

        if (alunos) SetAlunos(alunos);
        if (codigos) SetCodigos(codigos);
        if (admins) SetAdmins(admins);
        if (matriculas) SetMatriculas(matriculas);
    }

    function RetornarCadastros() {
        return (
            `ALUNOS:\n${JSON.stringify(Alunos, null, 2)}\n\n` +
            `CÓDIGOS:\n${JSON.stringify(Codigos, null, 2)}\n\n` +
            `MATRÍCULAS:\n${JSON.stringify(Matriculas, null, 2)}\n\n` +
            `ADMIN:\n${JSON.stringify(Admins, null, 2)}`
        );
    }

    function EncontrarObj() {
        let obj: any = null;

        if (campTabela === 'alunos') obj = Alunos.find(a => a.id === campId);
        else if (campTabela === 'codigo') obj = Codigos.find(c => c.id === campId);
        else if (campTabela === 'admin') obj = Admins.find(a => a.id === campId);
        else if (campTabela === 'matriculas') obj = Matriculas.find(m => m.id === campId);

        if (!obj) { Alert.alert('ID não encontrado'); return; }

        SetCampValor(obj.valor ?? '');
        SetCampUso(obj.uso ?? false);
        SetCampNome(obj.nome ?? '');
        setTela('editar');
    }

    async function AlterarObj() {
        let updateData: any = {};

        if (campTabela === 'alunos') updateData = { nome: campNome, uso: campUso };
        else if (campTabela === 'codigo') updateData = { valor: campValor, uso: campUso };
        else if (campTabela === 'admin' || campTabela === 'matriculas') updateData = { valor: campValor };

        const { error } = await supabase.from(campTabela).update(updateData).eq('id', campId);

        if (error) { Alert.alert('Erro ao salvar: ' + error.message); return; }

        Alert.alert('Alterado com sucesso!');
        await carregarTudo();
        setTela('hub');
    }

    return (
        <View style={style.ScreenContainer}>

            {/* VER */}
            <View style={{ display: tela === 'ver' ? 'flex' : 'none' }}>
                <ScrollView style={{ height: 700 }}>
                    <Text>{RetornarCadastros()}</Text>
                </ScrollView>
                <Botao fala="Alterar Cadastro" funcao={() => setTela('buscar')} />
                <Botao fala="Voltar" funcao={() => setTela('hub')} />
            </View>

            {/* BUSCAR */}
            <View style={{ display: tela === 'buscar' ? 'flex' : 'none' }}>
                <Text>Tabela: alunos | codigo | admin | matriculas</Text>
                <TextInput
                    onChangeText={SetCampTabela}
                    placeholder="Nome da tabela"
                    style={style.Input}
                />
                <TextInput
                    onChangeText={(t) => SetCampId(Number(t))}
                    placeholder="ID do registro"
                    keyboardType="numeric"
                    style={style.Input}
                />
                <Botao fala="Encontrar" funcao={EncontrarObj} />
                <Botao fala="Cancelar" funcao={() => setTela('ver')} />
            </View>

            {/* EDITAR */}
            <View style={{ display: tela === 'editar' ? 'flex' : 'none' }}>
                {campTabela === 'alunos' && (
                    <>
                        <Text>Nome:</Text>
                        <TextInput value={campNome} onChangeText={SetCampNome} style={style.Input} />
                    </>
                )}
                {(campTabela === 'codigo' || campTabela === 'admin' || campTabela === 'matriculas') && (
                    <>
                        <Text>Valor:</Text>
                        <TextInput value={campValor} onChangeText={SetCampValor} style={style.Input} />
                    </>
                )}
                {(campTabela === 'alunos' || campTabela === 'codigo') && (
                    <>
                        <Text>Uso:</Text>
                        <Botao fala={campUso ? 'True' : 'False'} funcao={() => SetCampUso(!campUso)} />
                    </>
                )}
                <Botao fala="Salvar Alterações" funcao={AlterarObj} />
                <Botao fala="Cancelar" funcao={() => setTela('ver')} />
            </View>

            {/* HUB */}
            <View style={{ justifyContent: 'center', alignItems: 'center', display: tela === 'hub' ? 'flex' : 'none' }}>
                <Text style={{ fontSize: 50 }}>Admin Screen</Text>
                <Botao fala="Ver Cadastros" funcao={() => setTela('ver')} />
                <Botao fala="Sair" funcao={() => router.navigate('/')} />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    ScreenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    Input: { height: 30, width: 300, backgroundColor: 'cyan', borderRadius: 5, margin: 2 },
});
