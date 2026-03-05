import Botao from '@/componentes/Botao'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

type SessaoType = {
  id?: number
  cod: string
  uso: boolean
  tipo: string
}

export default function GetTicket() {

  const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(null)

  useEffect(() => {

    async function Receber_dados() {

      const Sessao = await AsyncStorage.getItem("SessaoAtual")

      if (Sessao) {
        SetSessaoObj(JSON.parse(Sessao))
      }

    }

    Receber_dados()

  }, [])


  async function PegarTicket() {

    if (!SessaoObj) {
      Alert.alert("Sessão inválida")
      return
    }

    if (SessaoObj.uso) {
      Alert.alert("Você já possui um ticket disponível")
      return
    }

    let tabela = ""

    if (SessaoObj.tipo === "cod") tabela = "cods"
    if (SessaoObj.tipo === "matricula") tabela = "matriculas"

    const { error } = await supabase
      .from(tabela)
      .update({ uso: true })
      .eq("id", SessaoObj.id)

    if (error) {
      Alert.alert("Erro ao pegar ticket")
      return
    }

    const novaSessao = {
      ...SessaoObj,
      uso: true
    }

    SetSessaoObj(novaSessao)

    await AsyncStorage.setItem("SessaoAtual", JSON.stringify(novaSessao))

    Alert.alert("Ticket adquirido com sucesso")

  }


  return (

    <View style={styles.container}>

      <Text style={{ fontSize: 50 }}>Get Ticket</Text>

      <Text>Sessão atual {SessaoObj?.cod}</Text>

      <Text>
        Status ticket: {SessaoObj?.uso ? "Disponível" : "Indisponível"}
      </Text>

      <Botao
        fala={'Pegar Ticket'}
        funcao={PegarTicket}
      />

      <Botao
        fala={'Voltar'}
        funcao={() => router.push("/Home")}
      />

    </View>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'column',
  }
})