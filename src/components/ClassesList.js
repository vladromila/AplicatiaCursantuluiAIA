import React from 'react';
import { ScrollView, Text, AsyncStorage, View } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, Icon } from 'react-native-elements'
import { monthsShort } from './months'

class ClassesList extends React.Component {
    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                {this.props.fClasses.map((classData, i) => {
                    return <ListItem
                        key={i}
                        containerStyle={{ backgroundColor: 'rgba(66, 134, 244, 0.5)', borderRadius: 6, margin: 4, borderBottomColor: 'rgba(0,0,0,0)', zIndex: 99 }}
                        leftIcon={<View style={{ flexDirection: 'column', borderRightWidth: 3, borderRightColor: 'red' }}>
                            <View style={{ marginRight: 10 }}>
                                <Text style={{ fontSize: 19, fontWeight: '500' }}>{classData.hour < 10 ? `0${classData.hour}` : `${classData.hour}`}:{classData.minutes >= 0 && classData.minutes < 10 ? `${classData.minutes}0` : `${classData.minutes}`}</Text>
                                <Text style={{ fontSize: 16 }}>{classData.minutes + 30 >= 60 ? `${classData.hour + 2}` : `${classData.hour + 1}`}:{(classData.minutes + 30) % 60 >= 0 && (classData.minutes + 30) % 60 < 10 ? `${(classData.minutes + 30) % 60}0` : `${(classData.minutes + 30) % 60}`}</Text></View></View>}
                        title={<View style={{ marginLeft: 6, flexDirection: 'column' }}>{classData.location !== '' && classData.location ? <Text style={{ fontSize: 17, fontWeight: '200' }}>Locatie: <Text style={{ fontWeight: 'bold' }}>{`${classData.location}`}</Text></Text> : null}<Text style={{ fontSize: 19, fontWeight: '700' }}>{classData.day} {monthsShort[classData.month]} {classData.year}</Text><Text style={{ fontSize: 17, fontWeight: '200' }}>{classData.tip === "normala" ? "Sedinta de scolarizare" : "Sedinta de perfectionare"}</Text></View>}
                        hideChevron
                    />
                })}
            </ScrollView>
        );
    }
}
mapStateToProps = state => {
    const { fClasses, studentName } = state.ClassesReducer;
    return { fClasses, studentName }
}
export default connect(mapStateToProps)(ClassesList);