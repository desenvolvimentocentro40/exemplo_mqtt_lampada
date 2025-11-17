const led=document.getElementById("led")
const lampada=document.getElementById("lampada")
const txttopico=document.getElementById("txttopico")
const topico="SenaiCentro4.0Contagem/2025/lampada"
const reload=document.getElementById("reload")

txttopico.innerHTML=`Tópico: ${topico}`

const BROKER_HOST = 'mqtt-dashboard.com'
const BROKER_PORT = 8884
const BROKER_USER = ''
const BROKER_PASS = ''
const CLIENT_ID = "exmploLampada_" + parseInt(Math.random() * 10000)

let client = new Paho.MQTT.Client(BROKER_HOST, BROKER_PORT, CLIENT_ID)

function conectarMQTT(){
    reload.classList.add("animaIconReconnect")
    const connectOptions = {
        useSSL: true,
        userName: BROKER_USER,
        password: BROKER_PASS,
        onSuccess: onConnect, // Função que será chamada no sucesso
        onFailure: onFailure, // Função que será chamada na falha
        timeout: 5
    }
    desconectarMQTT()
    client.connect(connectOptions)
    led.classList.remove("led_desconectado")
    led.classList.remove("led_erro")
    led.classList.remove("led_conectado")
    led.classList.add("led_conectando")
}

const desconectarMQTT=()=>{
    if (client && client.isConnected && client.isConnected()) {
        reload.classList.remove("animaIconReconnect")
        client.disconnect()
        led.classList.remove("led_erro")
        led.classList.remove("led_conectado")
        led.classList.remove("led_conectando")
        led.classList.add("led_desconectado")
    }
}

function onConnect(){
    reload.classList.remove("animaIconReconnect")
    led.classList.remove("led_erro")
    led.classList.remove("led_conectando")
    led.classList.remove("led_desconectado")
    led.classList.add("led_conectado")
	client.subscribe(topico)
}

function onFailure(responseObject){
    led.classList.remove("led_conectando")
    led.classList.remove("led_desconectado")
    led.classList.remove("led_conectado")
    led.classList.add("led_erro")
}

function onConnectionLost(responseObject){
	if (responseObject.errorCode !== 0) {
        led.classList.remove("led_conectando")
        led.classList.remove("led_conectado")
        led.classList.remove("led_erro")
        led.classList.add("led_desconectado")
	}
}

function publish(msg){
    const pahoMessage = new Paho.MQTT.Message(msg)
    pahoMessage.destinationName = topico;
    client.send(pahoMessage);
}

function onMessageArrived(message){
	const topico = message.destinationName;
	const payload = message.payloadString;
    if(payload=="1"){
        ligarLampada()
    }else if(payload=="0"){
        desligarLampada()
    }
}

function reconectar(){
    desconectarMQTT()
    conectarMQTT()
}

client.onConnectionLost = onConnectionLost
client.onMessageArrived = onMessageArrived

function ligarLampada(){
    lampada.src="../imgs/lampada_on.png"
}

function desligarLampada(){
    lampada.src="../imgs/lampada_off.png"
}

conectarMQTT()
