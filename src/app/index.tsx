import { createClient } from '@supabase/supabase-js'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import Botao from '../componentes/Botao'

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Index() {

    const [CampoAl, SetCampoAl] = useState('')
    const [CampoADM, SetCampoADM] = useState('')

    const [ViwerADM, SetViwerADM] = useState<'none' | 'flex'>('none')
    const [ViwerEST, SetViwerEST] = useState<'none' | 'flex'>('flex')


    async function VerificarM_C() {

        const { data: matriculas } = await supabase
            .from('matriculas')
            .select('*')
            .eq('cod', CampoAl)
            .single()

        const { data: cods } = await supabase
            .from('codigos')
            .select('*')
            .eq('cod', CampoAl)
            .single()

        let usuario = null

        if (matriculas) {
            usuario = { ...matriculas, tipo: "matricula" }
        }

        if (cods) {
            usuario = { ...cods, tipo: "cod" }
        }

        if (!usuario) {
            Alert.alert("Matrícula ou código inválido")
            return
        }

        await AsyncStorage.setItem('SessaoAtual', JSON.stringify(usuario))
        router.push('/Home')
    }

    async function VerificarADM() {

        const { data, error } = await supabase
            .from('senhasadm')
            .select('*')
            .eq('cod', CampoADM)
            .single()

        if (data) {
            await AsyncStorage.setItem('Sessao', JSON.stringify(data))
            router.push('/Admin')
            return
        }

        Alert.alert("Senha inválida")
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

                <TextInput
                    placeholder='matrícula ou código'
                    onChangeText={(nome) => { SetCampoAl(nome) }}
                    style={{ backgroundColor: 'cyan', height: 50, width: "80%", bottom: 15, borderRadius: 15 }}
                />

                <Botao fala={"Verificar"} funcao={VerificarM_C} />
                <Botao funcao={trocar} fala={'trocar ADM'} />

            </View>


            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', display: ViwerADM }}>

                <Text style={{ fontSize: 50, margin: 30 }}>Login Adm</Text>

                <TextInput
                    placeholder='SenhaADM'
                    onChangeText={(senha) => { SetCampoADM(senha) }}
                    style={{ backgroundColor: 'cyan', height: 50, width: "80%", bottom: 15, borderRadius: 15 }}
                />

                <Botao fala={'Verificar'} funcao={VerificarADM} />
                <Botao fala={"trocar Aluno"} funcao={trocar} />

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})