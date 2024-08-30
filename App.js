import React from 'react';
import { SafeAreaView, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { UserProvider } from './src/context/UserContext';

const App = () => {
  // useEffect(() => {
  //   const getImageFromStorage = async (nameFolder) => {
  //     try {
  //       const reportAssetsRef = storage().ref(nameFolder);
        
  //       // Get a list of all subfolders in reportAssets
  //       const subfolders = await reportAssetsRef.listAll();
        
  //       // Loop through each subfolder
  //       subfolders.prefixes.forEach(async (subfolder) => {
  //         const folderName = subfolder.path.split('/').pop();
          
  //         const folderRef = reportAssetsRef.child(folderName);
      
  //         // Get a list of all files in the subfolder
  //         const files = await folderRef.listAll();
          
  //         // Loop through each file and get the download URL
  //         const imagePromises = files.items.map(async (file) => {
  //           const fileName = file.name;
  //           const fileRef = folderRef.child(fileName);
  //           return fileRef.getDownloadURL();
  //         });
          
  //         // Wait for all promises to resolve
  //         const images = await Promise.all(imagePromises);
          
  //         // Update Firestore
  //         const articleRef = firestore().collection('articles').doc(folderName);
  //         articleRef.update({
  //           responseImages: images
  //         })
  //         .then(() => {
  //           console.log(`Updated reportImage for article ${folderName}`);
  //         })
  //         .catch((error) => {
  //           console.error(`Error updating reportImage for article ${folderName}:`, error);
  //         });
  //       });
  //       console.log("Complete");
        
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  
  //   getImageFromStorage('responseAssets');
  // }, [])
  
  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <UserProvider>
          <BottomTabNavigation />
        </UserProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
