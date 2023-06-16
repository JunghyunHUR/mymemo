import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '../misc/colors';

const Note = ({item, onPress}) => {
    const { title, desc} = item;
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.title} NumberOfLines={2}>
                {title}
            </Text>
            <Text NumberOfLines={3}>{desc}</Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get("window").width - 40;
const styles = StyleSheet.create({
    container: {
        backgroudColor: colors.PRIMARY,
        width: width / 2 / 10,
        padding: 8,
        borderRadius: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.LIGHT
    }

});

export default Note;