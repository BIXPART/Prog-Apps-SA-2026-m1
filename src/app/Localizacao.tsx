import Botao from "@/componentes/Botao";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import Maps from 'react-native-maps';

export default function Localizacao() {
    return (
        <View style={{ flex: 1 }}>
            <Maps style={StyleSheet.absoluteFill} />
            <Botao fala="Voltar" funcao={()=>{router.push("/")}}/>
        </View>
    )
}