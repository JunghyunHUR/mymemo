import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Modal, 
    StatusBar, 
    TextInput, 
    TouchableWithoutFeedback, 
    Keyboard
    } from "react-native";
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';

const NoteInputModal = ({visible, onClose, onSubmit, note, isEdit}) => {
    const [title, setTitle] = useState("");
    const [desc , setDesc] = useState("");
    const handleModalClose = () => {
        Keyboard.dismiss();
    }

    useEffect(() => {
        if(isEdit == true){
            setTitle(note.title);
            setDesc(note.desc);
        }
    }, [isEdit])

    const handleOnChangeText = (text, valueFor) => {
        if(valueFor === 'title')setTitle(text);
        if(valueFor === 'desc')setDesc(text);
    }

    const handleOnSubmit = () => {
        if(!title.trim() && !desc.trim()) return onClose();
        if(isEdit){
            onSubmit(title, desc, Date.now());
        }else{
            onSubmit(title, desc);
            setTitle("");
            setDesc("");
        }
        onClose();
    }

    const closeModal = () => {
        if(!isEdit){
            setTitle("");
            setDesc("");
        }
        onClose();
    }

    return (
        <>
          <StatusBar hidden />  
          <Modal visible={visible} animationType='fade'>
                <View style={styles.container}>
                    <TextInput 
                        value={title}
                        onChange={text => handleOnChangeText(text, "title")}
                        placeholder='제목을 입력하세요.'
                        style={[styles.input, styles.title]}
                    />
                    <TextInput 
                        value={desc}
                        multiline
                        placeholder='내용을 입력하세요.'
                        style={[styles.input, styles.desc]}
                        onChange={text => handleOnChangeText(text, "desc")}
                    />
                    <View style={styles.btnContainer}>
                        <RoundIconBtn 
                            size={15}
                            antIconName="check"
                            onPress={handleOnSubmit}
                        />
                        {title.trim() || desc.trim() ? (
                            <RoundIconBtn 
                                size={15}
                                style={{marginLeft: 15}}
                                antIconName="close"
                                onPress={closeModal}
                            />
                        ): null}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={handleModalClose}>
                    <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
                </TouchableWithoutFeedback>
          </Modal>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 15
    },
    input:{
        borderBottomWidth: 2,
        borderBottomColor: colors.PRIMARY,
        fontSize: 20,
        color: colors.DARK
    },
    title: {

    },
    desc: {
        
    },
    modalBG: {

    },
    btnContainer: {

    }

});

export default NoteInputModal;