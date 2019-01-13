import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class Camera extends React.Component {
  state = {
    hasCameraPermission: null,
    isCameraVisible: false
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.setState({ isCameraVisible: true })
  }
  static navigationOptions = {
    header: null
  }
  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.isCameraVisible === true ?
            <BarCodeScanner
              onBarCodeScanned={this.handleBarCodeScanned}
              style={StyleSheet.absoluteFill}
            />
            : <View style={{ backgroundColor: 'black', flex: 1 }}></View>
        }
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ isCameraVisible: false })
    if (data.length === 49 && data[28] === '+') {
      const uids = data.split('+')
      AsyncStorage.setItem('uid', uids[0])
        .then(() => {
          AsyncStorage.setItem('studentUid', uids[1])
            .then(() => {
              fetch('https://agendainstructoruluiautoserver.herokuapp.com/getStudentData', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uid: uids[0],
                  studentUid: uids[1]
                }),
              })
                .then((data) => data.json()
                  .then((data) => {
                    AsyncStorage.setItem('fClasses', JSON.stringify(data.fClasses || []))
                      .then(() => {
                        AsyncStorage.setItem('nClasses', JSON.stringify(data.nClasses || []))
                          .then(() => {
                            AsyncStorage.setItem('sClasses', JSON.stringify(data.sClasses || []))
                              .then(() => {
                                console.log(data.studentName)
                                AsyncStorage.setItem('studentName',data.studentName)
                                  .then(() => {
                                    this.props.navigation.navigate('AppMain', { refresh: true })
                                  })
                              })
                          })
                      })
                  }))

            })
        })

    }
    else
      this.setState({ isCameraVisible: true })
  }
}