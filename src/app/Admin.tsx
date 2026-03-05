import Botao from "@/componentes/Botao";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

type CodsType = {
  id?: number;
  cod: string;
  uso: boolean;
  tipo: string;
};

export default function Admin() {

  const [Cods, SetCods] = useState<CodsType[]>([]);
  const [Matriculas, SetMatriculas] = useState<CodsType[]>([]);
  const [SenhasADM, SetSenhasADM] = useState<CodsType[]>([]);

  const [campArr, SetcampArr] = useState("");
  const [campObj, SetcampObj] = useState(0);

  const [campCod, SetcampCod] = useState("");
  const [campUso, SetcampUso] = useState<boolean>(false);
  const [campTipo, SetcampTipo] = useState("");

  const [tela, setTela] = useState<"hub" | "buscar" | "editar" | "ver">("hub");


  async function carregarTudo() {

    const { data: cods } = await supabase
      .from("cods")
      .select("*");

    const { data: matriculas } = await supabase
      .from("matriculas")
      .select("*");

    const { data: adm } = await supabase
      .from("senhasadm")
      .select("*");

    if (cods) SetCods(cods);
    if (matriculas) SetMatriculas(matriculas);
    if (adm) SetSenhasADM(adm);

  }

  useEffect(() => {
    carregarTudo();
  }, []);


  function RetornarCadastros(tipo: number) {

    let lista: CodsType[] = [];

    if (tipo == 1) lista = Cods;
    else if (tipo == 2) lista = Matriculas;
    else if (tipo == 3) lista = SenhasADM;

    return JSON.stringify(lista, null, 2);

  }


  function pegarArray(): CodsType[] {

    if (campArr === "cod") return [...Cods];
    if (campArr === "matricula") return [...Matriculas];
    if (campArr === "adm") return [...SenhasADM];

    return [];

  }


  function EncontrarOBj() {

    const arrayAtual = pegarArray();

    if (!arrayAtual[campObj]) {
      Alert.alert("Índice inválido");
      return;
    }

    const obj = arrayAtual[campObj];

    SetcampCod(obj.cod);
    SetcampUso(obj.uso);
    SetcampTipo(obj.tipo);

    setTela("editar");

  }


  async function AlterarObj() {

    const arrayAtual = pegarArray();

    if (!arrayAtual[campObj]) {
      Alert.alert("Índice inválido");
      return;
    }

    const obj = arrayAtual[campObj];

    let tabela = "";

    if (campArr === "cod") tabela = "cods";
    if (campArr === "matricula") tabela = "matriculas";
    if (campArr === "adm") tabela = "senhasadm";

    const { error } = await supabase
      .from(tabela)
      .update({
        cod: campCod,
        uso: campUso,
        tipo: campTipo
      })
      .eq("id", obj.id);

    if (error) {
      Alert.alert("Erro ao atualizar");
      return;
    }

    Alert.alert("Objeto alterado com sucesso!");

    await carregarTudo();

    setTela("hub");

  }


  async function LimparStorage() {

    await supabase.from("cods").delete().neq("id", 0);
    await supabase.from("matriculas").delete().neq("id", 0);
    await supabase.from("senhasadm").delete().neq("id", 0);

    Alert.alert("Banco limpo");

    carregarTudo();

  }


  return (
    <View style={style.ScreenContainer}>

      <View style={{ display: tela === "ver" ? "flex" : "none" }}>
        <ScrollView style={{ height: 700 }}>

          <Text>Códigos Visitante:{"\n"}{RetornarCadastros(1)}</Text>
          <Text>Matriculas:{"\n"}{RetornarCadastros(2)}</Text>
          <Text>Códigos ADM:{"\n"}{RetornarCadastros(3)}</Text>

        </ScrollView>

        <Botao fala="Alterar Cadastro" funcao={() => setTela("buscar")} />
        <Botao fala="Voltar" funcao={() => setTela("hub")} />
      </View>


      <View style={{ display: tela === "buscar" ? "flex" : "none" }}>

        <Text>Digite qual Array e qual índice deseja modificar</Text>

        <TextInput
          onChangeText={(texto) => SetcampArr(texto)}
          placeholder="Array: cod | matricula | adm"
        />

        <TextInput
          onChangeText={(texto) => SetcampObj(Number(texto))}
          placeholder="Índice do objeto"
        />

        <Botao fala="Encontrar OBJ" funcao={EncontrarOBj} />
        <Botao fala="Cancelar" funcao={() => setTela("ver")} />

      </View>


      <View style={{ display: tela === "editar" ? "flex" : "none" }}>

        <TextInput
          value={campCod}
          onChangeText={SetcampCod}
          style={style.Input}
          placeholder="Código:string"
        />

        <Text style={{ marginTop: 10 }}>Uso:</Text>

        <Botao
          fala={campUso ? "True" : "False"}
          funcao={() => SetcampUso(!campUso)}
        />

        <TextInput
          value={campTipo}
          onChangeText={SetcampTipo}
          style={style.Input}
          placeholder="tipo:string"
        />

        <Botao fala="Salvar Alterações" funcao={AlterarObj} />
        <Botao fala="Cancelar" funcao={() => setTela("ver")} />

      </View>


      <View style={{ justifyContent: "center", alignItems: "center", display: tela === "hub" ? "flex" : "none" }}>

        <Text style={{ fontSize: 50 }}>Admin Screen</Text>

        <Botao fala="Ver Cadastros" funcao={() => setTela("ver")} />
        <Botao fala="Limpar Banco" funcao={LimparStorage} />
        <Botao fala="Sair" funcao={() => { router.navigate("/") }} />

      </View>

    </View>
  );
}


const style = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  Input: {
    height: 30,
    width: 300,
    backgroundColor: "cyan",
    borderRadius: 5,
    margin: 2
  }
});