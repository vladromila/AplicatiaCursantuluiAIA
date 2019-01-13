import React from 'react';
import { Text, AsyncStorage } from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import ClassesList from './src/components/ClassesList'
import NClassesList from './src/components/NClassesList';
import SClassesList from './src/components/SClassesList';
import { Icon, Header } from 'react-native-elements';
import { fetchedData } from './src/actions'

ClassesList.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <Icon name="home" style={{ color: tintColor }} />
  )
}


const App = createAppContainer(createMaterialTopTabNavigator({
  ClassesList: {
    screen: ClassesList
  },
  NClassesList: {
    screen: NClassesList
  },
  SClassesList: {
    screen: SClassesList
  }
}, {
    animationEnabled: true,
    swipeEnabled: true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        ...Platform.select({
          android: {
            backgroundColor: 'white'
          }
        })
      },
      indicatorStyle: {
        backgroundColor: '#1E6EC7'
      },
      upperCaseLabel: false,
      activeTintColor: '#1E6EC7',
      inactiveTintColor: '#d1cece',
      pressColor: '#1E6EC7',
      showLabel: true,
      showIcon: false
    }
  }))
ClassesList.navigationOptions = {
  title: "Sed. programate",
}
NClassesList.navigationOptions = {
  title: "Sed. de scol. efectuate"
}
SClassesList.navigationOptions = {
  title: "Sed. de perf. efectuate"
}
class AppMain extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()
    this.state = {
      uid: null,
      studentUid: null,
      studentName: ''
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refresh === true)
      this.retrieveData();
  }
  componentWillMount() {
    this.retrieveData()
    this.fetchAndRetrieve();
  }
  fetchAndRetrieve() {
    AsyncStorage.getItem('uid').then((uid) => {
      AsyncStorage.getItem('studentUid')
        .then((studentUid) => {
          if (uid)
            fetch('https://agendainstructoruluiautoserver.herokuapp.com/getStudentData', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uid: uid,
                studentUid: studentUid
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
                              AsyncStorage.setItem('studentName', data.studentName)
                                .then(() => {
                                  this.retrieveData();
                                })
                            })
                        })
                    })
                }))
        })
    })
  }

  retrieveData = () => {
    AsyncStorage.getItem('uid').then((uid) => {
      this.setState({ uid })
      AsyncStorage.getItem('studentUid')
        .then((studentUid) => {
          this.setState({ studentUid })
          AsyncStorage.getItem('fClasses')
            .then((fClasses) => {
              AsyncStorage.getItem('nClasses')
                .then((nClasses) => {
                  AsyncStorage.getItem('sClasses')
                    .then((sClasses) => {
                      AsyncStorage.getItem('studentName')
                        .then((studentName) => {
                          this.setState({ studentName })
                          this.props.fetchedData({ fClasses: JSON.parse(fClasses) || [], nClasses: JSON.parse(nClasses) || [], sClasses: JSON.parse(sClasses) || [], studentName: studentName })
                        })
                    })
                })
            })
        })
    })
  }

  render() {
    return (
      <React.Fragment>
        <Header
          backgroundColor="#1E6EC7"
          centerComponent={<Text style={{ fontSize: 21, color: 'white', fontWeight: 'bold' }}>{this.state.studentName || 'Elevi'}</Text>}
          leftComponent={this.state.uid === null ? <Icon name="photo-camera" size={27} color='white' onPress={() => {
            this.props.navigation.navigate('Camera')
          }} /> : <Icon name='refresh' onPress={() => {
            this.fetchAndRetrieve();
          }} />}
          rightComponent={<Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }} onPress={async () => {
            await AsyncStorage.clear()
              .then(() => {
                this.retrieveData()
              })
          }}>Reset</Text>}
        />
        <App data={this.state.nClasses} />
      </React.Fragment>
    );
  }
}
export default connect(() => { return {} }, { fetchedData })(AppMain);