import { PermissionsAndroid, Platform } from "react-native";

const requestPhotoLibraryPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Photo Library Permission",
          message: "This app needs access to your photo library to upload images.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can access the photo library");
      } else {
        console.log("Photo library permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
};
export default requestPhotoLibraryPermission;