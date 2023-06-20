import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, StatusBar, FlatList, SafeAreaView } from "react-native";
import Note from '../components/Note';
import NotFound from '../components/NotFound';
import RoundIconBtn from '../components/RoundIconBtn';
import colors from "../misc/colors";
import { useNotes } from "../contexts/NoteProvider";
import NoteInputModal from '../components/NoteInputModal';
import SearchBar from '../components/SearchBar';

const reverseData = data => {
    return data.sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if(aInt < bInt) return 1;
        if(aInt === bInt) return 0;
        if(aInt > bInt) return -1;
    });
}

const NoteScreen = ({user, navigation}) => {
    const [greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [resultNotFound, setResultNotFound] = useState(false);
    
    const {notes, setNotes, findNotes} = useNotes();

    const findGreet = () => {
        const hrs = new Date().getHours();
        if(hrs === 0 || hrs < 12) return setGreet("오전");
        if(hrs == 1 || hrs < 17) return setGreet("오후");
        setGreet("밤");
    }
    useEffect(() => {
        findGreet();
    }, []);

    const reverseNotes = reverseData(notes);

    const handleOnSubmit = async(title, desc) => {
        const note = {id: Date.now(), title, desc, time: Date.now()};
        const updateNotes = [...notes, note];
        setNotes(updateNotes);
        await AsyncStorage.setItem("notes", JSON.stringify(updateNotes));
    }

    const openNote = (note) => {
        navigation.navigate("NoteDetail", { note });
    }

    const handleOnSearchInput = async text => {
        setSearchQuery(text);
        if(!text.trim()){
            setSearchQuery('');
            setResultNotFound(false);
            return await findNotes();
        }
        
        const filterNote = notes.filter( note => {
            if(note.title.toLowerCase().includes(text.toLowerCase())){
                return note;
            }
        });
    
        if(filterNote.length){
            setNotes([...filterNote]);
        }else{
            setResultNotFound(true);
        }
    }
    const handleOnClear = async () => {
        setSearchQuery("");
        setResultNotFound(false);
        await findNotes();
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroudColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.greet}>
                        {user.name}님, {greet}입니다. 반갑습니다.
                    </Text>
                {notes.length ? (
                    <SearchBar
                        value={searchQuery}
                        onChangeText={handleOnSearchInput}
                        containerStyle={{marginVertival: 15}}
                        onClear={handleOnClear}
                    />) : null
                

                }
                {resultNotFound ? (
                    <NotFound />
                ) : (
                    <FlatList
                    data={reverseNotes}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: 15
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <Note onPress={() => openNote(item)} item={item} />
                        )}
                        />
                        )}
                {
                    !notes.length ? (
                        <View
                        style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}
                        >
                            <Text style={styles.emptyHeader}>
                                Add Notes
                            </Text>
                        </View>
                    ) : null
                }
                </View>
            </TouchableWithoutFeedback>
            <RoundIconBtn 
                antIconName="plus" 
                style={styles.addBtn}
                onPress={() => setModalVisible(true)}
            />
            <NoteInputModal 
                visible={modalVisible} 
                onClose={()=>setModalVisible(false)} 
                onSubmit={handleOnSubmit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 15,
        fontWeight: "bold"
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1
    },
    emptyHeader: {
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: "bold",
        opacity: 0.2
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1
    },
    addBtn: {
        position: "absolute",
        right: 15,
        bottom: 50,
        zIndex: 1
    },
    greet: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 15,
        color: colors.DARK
    }
});

export default NoteScreen;