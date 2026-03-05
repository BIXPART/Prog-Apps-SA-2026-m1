import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from "expo-location"
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Botao from '../componentes/Botao'

import { createClient } from '@supabase/supabase-js'

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

export default function UseTicket() {

  const raio = 6371e3

  const latitudeAluno = -27.618356
  const longitudeAluno = -48.664254

  const [loading, setLoading] = useState(false)
  const [SessaoObj, SetSessaoObj] = useState<SessaoType | null>(null)


  async function getLocation(): Promise<number | null> {

    try {

      setLoading(true)

      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        return null
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      })

      return calcularDistancia(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      )

    } catch {
      return null
    } finally {
      setLoading(false)
    }

  }


  function calcularDistancia(latitude: number, longitude: number): number {

    const lat1 = latitude * (Math.PI / 180)
    const lat2 = latitudeAluno * (Math.PI / 180)

    const deltaLat = (latitudeAluno - latitude) * (Math.PI / 180)
    const deltaLon = (longitudeAluno - longitude) * (Math.PI / 180)

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return raio * c

  }


  useEffect(() => {

    async function Receber_dados() {

      const Sessao = await AsyncStorage.getItem("SessaoAtual")

      if (Sessao) {
        SetSessaoObj(JSON.parse(Sessao))
      }

    }

    Receber_dados()

  }, [])



  async function UsarTicket() {

    const distancia = await getLocation()

    if (distancia === null) {
      Alert.alert("Não foi possível obter localização.")
      return
    }

    if (distancia > 200) {
      Alert.alert("Você não está dentro do raio permitido.")
      return
    }

    if (!SessaoObj) {
      Alert.alert("Sessão inválida")
      return
    }

    if (!SessaoObj.uso) {
      Alert.alert("Você não tem um ticket disponível.")
      return
    }

    let tabela = ""

    if (SessaoObj.tipo === "cod") tabela = "cods"
    if (SessaoObj.tipo === "matricula") tabela = "matriculas"

    const { error } = await supabase
      .from(tabela)
      .update({ uso: false })
      .eq("id", SessaoObj.id)

    if (error) {
      Alert.alert("Erro ao usar ticket")
      return
    }

    const novaSessao = {
      ...SessaoObj,
      uso: false
    }

    SetSessaoObj(novaSessao)

    await AsyncStorage.setItem("SessaoAtual", JSON.stringify(novaSessao))

    Alert.alert("Ticket Usado")

  }


  return (

    <View style={styles.container}>

      <Text style={{ fontSize: 50 }}>Usar Ticket</Text>

      <Text>Olá {SessaoObj?.cod}</Text>

      <Text>Bem vindo</Text>

      <Text>
        Status ticket: {SessaoObj?.uso ? "Disponível" : "Indisponível"}
      </Text>

      <Botao fala={'Usar Ticket'} funcao={UsarTicket} />
      <Botao fala={'Voltar'} funcao={() => router.push("/Home")} />

    </View>

  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})