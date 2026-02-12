import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Botao from '../componentes/Botao';

type SessaoType = {
  cod: string;
  uso: boolean;
  tipo: string;
};

export default function UseTicket() {

  const [sessao, setSessao] = useState<SessaoType | null>(null);

  useEffect(() => {
    carregarSessao();
  }, []);

  async function carregarSessao(): Promise<void> {
    const dados = await AsyncStorage.getItem('Sessao');

    if (dados) {
      const usuario: SessaoType = JSON.parse(dados);
      setSessao(usuario);
    }
  }

  function UsarTicket() {
    if(sessao?.cod){
      setSessao(sessao.cod = false)
    }

  }

  return (
    <View>

      <Text>Olá {sessao?.cod}</Text>

      <Text>bem vindo</Text>

      <Text>Status ticket: {sessao?.cod ? "Disponivel" : "Indisponivel"}</Text>
      <Botao fala={'Usar Ticket'} funcao={() => { UsarTicket() }}></Botao>

    </View>
  )


}