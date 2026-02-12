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

export default function UseTicket() {

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
        await AsyncStorage.setItem("SessaoAtual", SessaoString);
      }
    } Atualizar_Sessao();
  }, [SessaoObj])


  function UsarTicket() {
    if (SessaoObj?.cod) {
      console.log(typeof SessaoObj.cod);
      Alert.alert("Ticket Usado");
      SetSessaoObj({
        cod: SessaoObj.cod,
        uso: false,
        tipo: SessaoObj.tipo
      })
      return
    }
    Alert.alert("Você não tem um ticket para usar");
  }

  return (
    <View style={styles.container}>

      <Text style={{ fontSize: 50 }}>Usar Ticket</Text>

      <Text>Olá {SessaoObj?.cod}</Text>

      <Text>bem vindo</Text>

      <Text>Status ticket: {SessaoObj?.uso ? "Disponivel" : "Indisponivel"}</Text>
      <Botao fala={'Usar Ticket'} funcao={() => { UsarTicket() }}></Botao>
      <Botao fala={'Voltar'} funcao={() => {
        router.push("/Home")
      }}></Botao>
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