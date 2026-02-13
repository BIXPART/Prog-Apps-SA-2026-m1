import { Text, TouchableOpacity } from 'react-native';

export default function Botao(prop) {
  return (
    <TouchableOpacity 
      style={{
        bottom:prop.bottom,
        width: 100,
        height: 50,
        backgroundColor: 'blue',
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center',
        margin:5
      }}
      onPress={()=>{prop.funcao()}}
    >
      <Text style={{ color: 'white', fontSize: 16,textAlign:'center' }}>
        {prop.fala}
      </Text>
    </TouchableOpacity>
  );
}
