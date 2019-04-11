import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-elements";

import Deck from "./src/Deck/Deck";
import Data from "./src/Data/Data";
import Swipeup from "./src/Swipeup/Swipeup";

export default class App extends React.Component {
  renderCard = item => (
    // <View style={{ height: "80%" }}>
    <Card title={item.text} image={{ uri: item.uri }} key={item.id}>
      <Text style={{ marginBottom: 10 }}>I can customize</Text>
      <Button
        icon={{ name: "code" }}
        backgroundColor="#03A9F4"
        title="View Now!"
      />
    </Card>
    // </View>
  );

  renderNoMoreCards = () => (
    <Card title="All Done">
      <Text style={{ marginBottom: 10 }}>
        There's no more content available
      </Text>
      <Button backgroundColor="#03a9f4" title="Get more" />
    </Card>
  );

  render() {
    return (
      <View style={styles.container}>
        <Deck
          // <Swipeup
          data={Data}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    marginTop: 40
  }
});
