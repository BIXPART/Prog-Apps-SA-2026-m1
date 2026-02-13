import Botao from "@/componentes/Botao";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type CodsType = {
    cod: string;
    uso: boolean;
    tipo: string;
}

export default function Admin() {

    const [Cods, SetCods] = useState<CodsType[]>([]);
    const [Matriculas, SetMatriculas] = useState<CodsType[]>([]);
    const [SenhasADM, SetSenhasADM] = useState<CodsType[]>([]);

    const [campArr, SetcampArr] = useState("")
    const [campObj, SetcampObj] = useState(0)

    const [campCod, SetcampCod] = useState("")
    const [campUso, SetcampUso] = useState<boolean>(false)
    const [campTipo, SetcampTipo] = useState("")

    const [tela, setTela] = useState<"hub" | "buscar" | "editar" | "ver">("hub");


    useEffect(() => {
        async function carregarTudo() {

            const cods = await AsyncStorage.getItem('@Cods');
            const matriculas = await AsyncStorage.getItem('@Matrículas');
            const adm = await AsyncStorage.getItem('@SenhasADM');

            if (cods) SetCods(JSON.parse(cods));
            if (matriculas) SetMatriculas(JSON.parse(matriculas));
            if (adm) SetSenhasADM(JSON.parse(adm));
        }

        carregarTudo();
    }, []);

    function RetornarCadastros(tipo: number) {
        let lista: CodsType[] = [];

        if (tipo == 1) lista = Cods;
        else if (tipo == 2) lista = Matriculas;
        else if (tipo == 3) lista = SenhasADM;

        return JSON.stringify(lista, null, 2);
    }

    async function LimparStorage() {
        await AsyncStorage.clear();
        Alert.alert("é nessesario refazer o Login para ter efeito")
        console.log("é nessesario refazer o Login para ter efeito")
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

        // Preenche os campos automaticamente
        SetcampCod(obj.cod);
        SetcampUso(obj.uso);
        SetcampTipo(obj.tipo);

        // Vai para tela de edição
        setTela("editar");
    }

    async function salvarArray(novoArray: CodsType[]) {

        if (campArr === "cod") {
            SetCods(novoArray);
            await AsyncStorage.setItem('@Cods', JSON.stringify(novoArray));
        }

        if (campArr === "matricula") {
            SetMatriculas(novoArray);
            await AsyncStorage.setItem('@Matrículas', JSON.stringify(novoArray));
        }

        if (campArr === "adm") {
            SetSenhasADM(novoArray);
            await AsyncStorage.setItem('@SenhasADM', JSON.stringify(novoArray));
        }
    }

    async function AlterarObj() {

        const arrayAtual = pegarArray();

        if (!arrayAtual[campObj]) {
            Alert.alert("Índice inválido");
            return;
        }

        const novoObjeto: CodsType = {
            cod: campCod,
            uso: campUso ?? false,
            tipo: campTipo
        };

        const novoArray = arrayAtual.map((item, index) =>
            index === campObj ? novoObjeto : item
        );

        await salvarArray(novoArray);

        Alert.alert("Objeto alterado com sucesso!");

        setTela("hub"); // 👈 volta pro menu
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
                <Botao fala="Limpar AsyncStorage" funcao={LimparStorage} />
                <Botao fala="Sair" funcao={() => { router.navigate("/") }} />
            </View>
        </View>
    )
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
        backgroundColor: 'cyan',
        borderRadius: 5,
        margin: 2
    }
})