import { StatusBar } from "expo-status-bar";
import React, { ReactElement, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
navigator.geolocation = require("@react-native-community/geolocation");

const Address_Type_Map = {
  street_number: "street_number",
  route: "route",
  sublocality_level_1: "sublocality_level_1",
  administrative_area_level_1: "administrative_area_level_1",
  administrative_area_level_2: "administrative_area_level_2",
  country: "country",
  postal_code: "postal_code",
};

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

type Address = {
  [key in keyof typeof Address_Type_Map]: Pick<
    AddressComponent,
    "long_name" | "short_name"
  >;
};

interface Place {
  address: Address;
  location: {
    lat: number;
    lng: number;
  };
}

export default function App() {
  const googlePlacesAutocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [place, setPlace] = useState<Place | null>(null);

  function handleSelectPlace(
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) {
    const {
      address_components,
      geometry: { location },
    } = details as GooglePlaceDetail;

    const address = address_components.reduce(
      (acc, { long_name, short_name, types }) => {
        const [first_type] = types;

        const type =
          Address_Type_Map[first_type as keyof typeof Address_Type_Map];

        acc[type as keyof typeof Address_Type_Map] = {
          long_name: long_name,
          short_name: short_name,
        };

        return acc;
      },
      {} as Address
    );

    // console.log(JSON.stringify(address, null, 2));

    setPlace((state) => ({ ...state, address, location }));
  }

  const clearLocationTextInput = () => {
    googlePlacesAutocompleteRef.current?.clear();
    googlePlacesAutocompleteRef.current?.setAddressText("");
    setPlace(null);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flex: 1,
          paddingTop: 100,
        }}
      >
        <GooglePlacesAutocomplete
          onPress={handleSelectPlace}
          query={{
            key: "AIzaSyBatOwVE3MJjTTcl_LTNmS75zEPFLe5IT4",
            language: "pt-BR",
          }}
          styles={{
            container: {
              flex: 0,
              width: "90%",
              borderWidth: 0.5,
              borderRadius: 10,
              padding: 2,
              backgroundColor: "#fff",
            },
          }}
          placeholder="Seu endereço"
          fetchDetails
          // currentLocation
          // currentLocationLabel="Localização atual"
          enableHighAccuracyLocation
          enablePoweredByContainer={false}
          ref={googlePlacesAutocompleteRef}
          renderRightButton={(): ReactElement =>
            googlePlacesAutocompleteRef.current?.getAddressText() && (
              <TouchableOpacity
                onPress={clearLocationTextInput}
                style={{
                  borderColor: "#000",
                  backgroundColor: "#912222",
                  width: 50,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            )
          }
        />
        <View
          style={{
            flex: 1,
            width: "90%",
            paddingTop: 40,
            alignItems: "flex-start",
          }}
        >
          {place?.location.lat && (
            <>
              <Text style={{ color: "#fff" }}>
                Latitude: {place.location.lat}
              </Text>
              <Text style={{ color: "#fff" }}>
                Longitude: {place.location.lng}
              </Text>
              <Text style={{ color: "#fff", marginTop: 20 }}>
                Cep: {place.address.postal_code?.long_name}
              </Text>
              <Text style={{ color: "#fff" }}>
                Logradouro: {place.address.route?.long_name}
              </Text>
              <Text style={{ color: "#fff" }}>
                Número: {place.address.street_number?.long_name ?? "S\\N"}
              </Text>
              <Text style={{ color: "#fff" }}>
                Cidade: {place.address.administrative_area_level_2?.long_name}
              </Text>
              <Text style={{ color: "#fff" }}>
                Estado: {place.address.administrative_area_level_1?.long_name}
              </Text>
              <Text style={{ color: "#fff" }}>
                Bairro: {place.address.sublocality_level_1?.long_name}
              </Text>
              <Text style={{ color: "#fff" }}>
                País: {place.address.country?.long_name}
              </Text>
            </>
          )}
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
