import React, {useState} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  async function takePicture(camera){
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    
    setCapturedPhoto(data.uri);
    setOpen(true);

    //Chama salvar foto no album
    //savePicture(data.uri);
    //setEndFot(data.uri);

  }

  async function hasAndroidPermission(){
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if(hasPermission){
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted'
  }

  async function savePicture(data){
    //const data = endFoto;
      if(Platform.OS === 'android' && !(await hasAndroidPermission())){
      return;
    }

    CameraRoll.save(data, 'photo')
    .then((res) => {
      console.log('Salvo com sucesso: '+res);
    })
    .catch((error) => {
      console.log('Error ao salvar: '+error);
    })

    setOpen(false);
  }

  function openAlbum(){

  }

  function toggleCam(){
    setType(type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back);
  }
  return (
    <View style={styles.container}>
      
      <RNCamera 
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permissão para usar camera',
          message: 'Nós precisamos usar a sua camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancelar',
        }}
      >
        { ({camera, status, recordAndroidPermissionStatus}) => {
          if(status !== 'READY') {
            return <View />
          }            
          return(
            <View style={{marginBottom: 35, flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}}>
              <TouchableOpacity
                onPress={()=> takePicture(camera)}
                style={styles.capture}
              >
                <Text>TIRAR FOTO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>{}}
                style={styles.capture}
              >
                <Text>ALBUM</Text>
              </TouchableOpacity>

            </View>
          )
        }}

      </RNCamera>

      <View style={styles.camPosition}>
        <TouchableOpacity onPress={() => toggleCam()}>
          <Text>TROCAR</Text>
        </TouchableOpacity>
      </View>

      { capturedPhoto &&
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{flex:1, justifyContent:'center',alignItems:'center',margin:20}}>
             <Image 
              resizeMode="contain"
              style={{width:350,height:450,borderRadius:15}}
              source={{uri: capturedPhoto}}
            />
            <TouchableOpacity 
              style={{margin:10}}
              onPress={() => setOpen(false)}
            >              
              <Text>FECHAR</Text>
            </TouchableOpacity>


            <TouchableOpacity 
            style={{margin:10}}
            onPress={() => savePicture(capturedPhoto)}
            >              
              <Text>SALVAR FOTO</Text>
            </TouchableOpacity>



          </View>
        </Modal>
      }



    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
  },
  preview:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  capture:{
    flex:0,
    backgroundColor:'#FFF',
    borderRadius: 5,
    padding:15,
    paddingHorizontal:20,
    alignSelf:'center',
    margin:20,
  },
  camPosition:{
    backgroundColor:'#FFF',
    borderRadius:5,
    padding:10,
    height:40,
    position:'absolute',
    right:25,
    top: 60,
  }

})
