import { router,useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import Botao from '../componentes/Botao';

export default function Index() {


    const [Cods, SetCods] = useState([{ cod: '123', uso: true,tipo: "cod" }, { cod: '321', uso: true,tipo: "cod" }])
    const [Matrículas, SetMatriculas] = useState([{ cod: '54321', uso: true,tipo: "matricula" }])
    const [SenhasADM, SetSenhasADM] = useState([{ cod: '123', uso: true,tipo: "adm" }, { cod: '321', uso: true,tipo: "adm" }])

    const [CampoAl, SetCampoAl] = useState('')
    const [CampoADM, SetCampoADM] = useState('')

    const [ViwerADM, SetViwerADM] = useState('none')
    const [ViwerEST, SetViwerEST] = useState('block')



    function VerificarM_C() {
        const filtro = Matrículas.filter(mat => mat.cod === CampoAl);
        const filtro2 = Cods.filter(cod => cod.cod === CampoAl);

        if (filtro.length > 0) {
            router.push({
                pathname: "/Home",
                params: {
                    Sessao: JSON.stringify({
                        tipo: "matricula",
                        cod: filtro[0].cod,
                        uso: filtro[0].uso
                    })
                }
            });
            return;
        }

        if (filtro2.length > 0) {
            router.push({
                pathname: "/UsarTicket",
                params: {
                    Sessao: JSON.stringify({
                        tipo: "codigo",
                        cod: filtro2[0].cod,
                        uso: filtro2[0].uso
                    })
                }
            });
            return;
        }

        Alert.alert("Matrícula ou código inválido");
    }

    function VerificarADM() {
        let filtro = SenhasADM.filter(sen => sen.cod == CampoADM)
        if (filtro.length > 0) {
            Alert.alert("bem vindo ADM")
        }
    }

    function trocar() {
        if (ViwerADM == 'none') {
            SetViwerEST('none')
            SetViwerADM('block')
        } else {
            SetViwerADM('none')
            SetViwerEST('block')
        }
    }



    return (
        <View style={styles.container}>

            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerEST }}>
                <TextInput placeholder='matrícula ou código ' onChangeText={(nome) => { SetCampoAl(nome) }} style={{ backgroundColor: 'cyan', height: 50, width: 250, bottom: 15, borderRadius: 15 }}></TextInput>
                <Botao fala={"Verificar"} funcao={() => { VerificarM_C() }} />
                <Botao funcao={trocar} fala={'trocar ADM'}></Botao>
            </View>

            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerADM }}>
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
