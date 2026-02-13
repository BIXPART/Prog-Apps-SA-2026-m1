import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import Botao from '../componentes/Botao';

export default function Index() {


    const [Cods] = useState([{ cod: '123', uso: true, tipo: "cod" }, { cod: '321', uso: true, tipo: "cod" },{ cod: '472', uso: true, tipo: "cod" }])
    useEffect(() => {
        async function inicializar() {
            const dados = await AsyncStorage.getItem('@Cods');

            if (!dados) {
                await AsyncStorage.setItem('@Cods', JSON.stringify(Cods));
            }
        }

        inicializar();
    }, []);

    const [Matrículas] = useState([{ cod: '54321', uso: true, tipo: "matricula" }])
    useEffect(() => {
        async function inicializar() {
            const dados = await AsyncStorage.getItem('@Matrículas');

            if (!dados) {
                await AsyncStorage.setItem('@Matrículas', JSON.stringify(Matrículas));
            }
        }

        inicializar();
    }, []);

    const [SenhasADM] = useState([{ cod: '123', uso: true, tipo: "adm" }, { cod: '321', uso: true, tipo: "adm" }])
    useEffect(() => {
        async function inicializar() {
            const dados = await AsyncStorage.getItem('@SenhasADM');

            if (!dados) {
                await AsyncStorage.setItem('@SenhasADM', JSON.stringify(SenhasADM));
            }
        }

        inicializar();
    }, []);



    const [CampoAl, SetCampoAl] = useState('')
    const [CampoADM, SetCampoADM] = useState('')

    const [ViwerADM, SetViwerADM] = useState<'none' | 'flex'>('none')
    const [ViwerEST, SetViwerEST] = useState<'none' | 'flex'>('flex')



    async function VerificarM_C() {
        const filtroMat = Matrículas.find(mat => mat.cod === CampoAl);
        const filtroCod = Cods.find(cod => cod.cod === CampoAl);

        const usuario = filtroMat || filtroCod;

        if (!usuario) {
            Alert.alert("Matrícula ou código inválido");
            return
        } else {
            try {
                await AsyncStorage.setItem('SessaoAtual', JSON.stringify(usuario));
            } catch (error) {
                Alert.alert(String(error));
                return;
            }
            router.push('/Home');
            return

        }
    }
    async function VerificarADM() {
        const filtro = SenhasADM.find(sen => sen.cod === CampoADM);

        if (filtro) {
            await AsyncStorage.setItem('Sessao', JSON.stringify(filtro));
            router.push('/Admin');
            return;
        }

        Alert.alert("Senha inválida");
    }

    function trocar() {
        if (ViwerADM === 'none') {
            SetViwerEST('none')
            SetViwerADM('flex')
        } else {
            SetViwerADM('none')
            SetViwerEST('flex')
        }
    }



    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerEST }}>
                <Text style={{ fontSize: 50, margin: 30 }}>Login Aluno</Text>
                <TextInput placeholder='matrícula ou código ' onChangeText={(nome) => { SetCampoAl(nome) }} style={{ backgroundColor: 'cyan', height: 50, width: 250, bottom: 15, borderRadius: 15 }}></TextInput>
                <Botao fala={"Verificar"} funcao={() => { VerificarM_C() }} />
                <Botao funcao={trocar} fala={'trocar ADM'}></Botao>
            </View>

            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerADM }}>
                <Text style={{ fontSize: 50, margin: 30 }}>Login Adm</Text>
                <TextInput placeholder='SenhaADM' onChangeText={(senha) => { SetCampoADM(senha) }} style={{ backgroundColor: 'cyan', height: 50, width: 250, bottom: 15, borderRadius: 15 }}></TextInput>
                <Botao fala={'Verificar'} funcao={VerificarADM} />
                <Botao fala={"trocar Aluno"} funcao={trocar} />
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